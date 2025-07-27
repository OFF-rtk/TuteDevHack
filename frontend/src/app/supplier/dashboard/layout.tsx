'use client';
import React, { useEffect } from 'react';
import { useAppStore } from '@/stores/appStores';
import { Navbar } from '@/components/layout/Navbar';
import AlertModal from '@/components/ui/AlertModal';
import { useRouter } from 'next/navigation';

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  const { 
    currentUser, 
    session,
    error,
    fetchMyGroupBuys,
    fetchSupplierAnalytics,
    fetchMyProducts, // Also fetch products for the "create group buy" page
    logout
  } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/');
    } else {
      // Fetch all necessary data for the supplier section
      fetchSupplierAnalytics();
      fetchMyGroupBuys();
      fetchMyProducts();
    }
  }, [session, router, fetchSupplierAnalytics, fetchMyGroupBuys, fetchMyProducts]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (!currentUser) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-50">Loading Supplier...</div>;
  }
  
  // Add a role check for extra security
  if (currentUser.role !== 'SUPPLIER') {
     return <div className="flex items-center justify-center min-h-screen bg-gray-50">Access Denied.</div>;
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
    </div>
  );
}