'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/stores/appStores';

export default function HomePage() {
  const router = useRouter();
  const { session, currentUser } = useAppStore();

  useEffect(() => {
    if (session && currentUser) {
      // Redirect authenticated users to their dashboard
      if (currentUser.role === 'VENDOR') {
        router.push('/dashboard');
      } else if (currentUser.role === 'SUPPLIER') {
        router.push('/supplier/dashboard');
      }
    } else {
      // Redirect unauthenticated users to auth page
      router.push('/auth');
    }
  }, [session, currentUser, router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
