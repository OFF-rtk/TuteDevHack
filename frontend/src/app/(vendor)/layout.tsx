'use client';
import React, { useEffect } from 'react';
import { useAppStore } from '@/stores/appStores';
import { Navbar } from '@/components/layout/Navbar';
import  AlertModal  from '@/components/ui/AlertModal';
import  ConfirmModal  from '@/components/ui/ConfirmModal';
import  QuantityModal  from '@/components/ui/QuantityModal';
import { useRouter } from 'next/navigation';

export default function VendorLayout({ children }: { children: React.ReactNode }) {
    const { 
        currentUser, 
        modalState, 
        hideAlert, 
        confirmModalState, 
        hideConfirm, 
        quantityModalState, 
        hideQuantityModal,
        addOrder,
        logout
    } = useAppStore();
    const router = useRouter();

    // In a real app, you'd have more robust session management
    useEffect(() => {
        if (!currentUser) {
            router.push('/'); // Redirect to auth page if not logged in
        }
    }, [currentUser, router]);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    if (!currentUser) {
        // This can be a loading spinner
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar 
                user={currentUser} 
                handleLogout={handleLogout} 
            />
            <main className="flex-grow">
                {children}
            </main>
            <AlertModal
                isOpen={modalState.isOpen}
                onClose={modalState.onOk}
                title={modalState.title}
            >
                {modalState.message}
            </AlertModal>
            <ConfirmModal
                isOpen={confirmModalState.isOpen}
                onClose={hideConfirm}
                onConfirm={confirmModalState.onConfirm}
                title={confirmModalState.title}
            >
                {confirmModalState.message}
            </ConfirmModal>
            <QuantityModal
                isOpen={quantityModalState.isOpen}
                onClose={hideQuantityModal}
                onConfirm={(quantity) => addOrder(quantityModalState.groupBuy!, quantity)}
                groupBuy={quantityModalState.groupBuy}
            />
            {currentUser?.role === 'VENDOR' && (
                 <button className="fixed bottom-6 right-6 bg-orange-500 text-white w-16 h-16 rounded-full shadow-xl flex items-center justify-center z-20 transform transition-transform hover:scale-105 active:scale-95">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                         <path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4z" /><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm5 8.25V14a.75.75 0 01-1.5 0v-1.75a5.506 5.506 0 00-5-5.419V4a5 5 0 1110 0v2.831A5.506 5.506 0 0012 12.25z" clipRule="evenodd" />
                     </svg>
                 </button>
            )}
        </div>
    );
}
