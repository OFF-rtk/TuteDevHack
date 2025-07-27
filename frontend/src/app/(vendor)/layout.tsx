'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/stores/appStores';
import { Navbar } from '@/components/layout/Navbar';
import { AlertModal } from '@/components/ui/AlertModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { QuantityModal } from '@/components/ui/QuantityModal';

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const { 
    currentUser, 
    session,
    alertModal,
    confirmModal,
    closeAlertModal,
    closeConfirmModal,
    fetchGroupBuys,
    fetchMyOrders,
    logout
  } = useAppStore();
  const router = useRouter();
  
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle Zustand hydration
  useEffect(() => {
    const unsub = useAppStore.persist.onHydrate(() => setIsHydrated(true));
    if (useAppStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }
    return () => {
      unsub();
    };
  }, []);

  // Handle authentication and data fetching
  useEffect(() => {
    if (isHydrated) {
      if (!session) {
        router.push('/');
      } else if (currentUser?.role === 'SUPPLIER') {
        // Redirect suppliers to their dashboard
        router.push('/supplier/dashboard');
      } else if (currentUser?.role === 'VENDOR') {
        // Fetch data for vendors
        fetchGroupBuys();
        fetchMyOrders();
      }
    }
  }, [isHydrated, session, currentUser, router, fetchGroupBuys, fetchMyOrders]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Loading state during hydration
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF8F0]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
      </div>
    );
  }

  // Unauthenticated state
  if (!session || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF8F0]">
        <p className="text-gray-600">Redirecting...</p>
      </div>
    );
  }

  // Wrong role state
  if (currentUser.role !== 'VENDOR') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF8F0]">
        <p className="text-gray-600">Redirecting to appropriate dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8F0]">
      <Navbar 
        user={currentUser} 
        handleLogout={handleLogout} 
      />
      
      <main className="max-w-lg md:max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
      
      {/* Global Modals - Using your existing UI components */}
      <AlertModal />
      <ConfirmModal />
      <QuantityModal />
    </div>
  );
}
