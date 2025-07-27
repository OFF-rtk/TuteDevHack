'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/stores/appStores';
import { Navbar } from '@/components/layout/Navbar';
import { AlertModal } from '@/components/ui/AlertModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  const { 
    currentUser, 
    session,
    alertModal,
    confirmModal,
    closeAlertModal,
    closeConfirmModal,
    fetchMyGroupBuys,
    fetchSupplierAnalytics,
    fetchMyProducts,
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
      } else if (currentUser?.role === 'VENDOR') {
        // Redirect vendors to their dashboard
        router.push('/dashboard');
      } else if (currentUser?.role === 'SUPPLIER') {
        // Fetch data for suppliers
        fetchSupplierAnalytics();
        fetchMyGroupBuys();
        fetchMyProducts();
      }
    }
  }, [isHydrated, session, currentUser, router, fetchSupplierAnalytics, fetchMyGroupBuys, fetchMyProducts]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Loading state during hydration
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F1E8]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A7C59]"></div>
      </div>
    );
  }

  // Unauthenticated state
  if (!session || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F1E8]">
        <p className="text-gray-600">Redirecting...</p>
      </div>
    );
  }

  // Wrong role state
  if (currentUser.role !== 'SUPPLIER') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F1E8]">
        <p className="text-gray-600">Redirecting to appropriate dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
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
    </div>
  );
}
