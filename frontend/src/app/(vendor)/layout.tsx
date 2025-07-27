'use client';
import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/stores/appStores';
import { Navbar } from '@/components/layout/Navbar';
import AlertModal from '@/components/ui/AlertModal';
import { useRouter } from 'next/navigation';
import { VoiceOrderButton } from '@/components/features/VoiceOrderButton';

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const { 
    currentUser, 
    session,
    error,
    fetchGroupBuys,
    fetchMyOrders,
    logout
  } = useAppStore();
  const router = useRouter();
  
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const unsub = useAppStore.persist.onHydrate(() => setIsHydrated(true));
    if (useAppStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    if (isHydrated) {
      if (!session) {
        router.push('/');
      } else {
        fetchGroupBuys();
        fetchMyOrders();
      }
    }
  }, [isHydrated, session, router, fetchGroupBuys, fetchMyOrders]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (!isHydrated) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-50">Initializing Session...</div>;
  }

  if (!currentUser) {
     return <div className="flex items-center justify-center min-h-screen bg-gray-50">Redirecting...</div>;
  }
  
  // THE FIX: Add a role check to ensure this layout is only for vendors
  if (currentUser.role !== 'VENDOR') {
    // You can show an access denied message or redirect them
    // For now, we'll show a simple loader while the AuthPage redirects them
    return <div className="flex items-center justify-center min-h-screen bg-gray-50">Incorrect role, redirecting...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar 
        user={currentUser} 
        handleLogout={handleLogout} 
      />
      <main className="flex-grow">
        {children}
      </main>
      
      {error && <AlertModal isOpen={!!error} onClose={() => useAppStore.setState({ error: null })} title="An Error Occurred">{error}</AlertModal>}
      
      <VoiceOrderButton />
    </div>
  );
}