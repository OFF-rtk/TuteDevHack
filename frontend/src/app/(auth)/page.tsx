'use client';
import React, { useState } from 'react';
import { useAppStore } from '@/stores/appStores';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Input  from '@/components/ui/Input';
import  Button from '@/components/ui/Button';
import  Logo  from '@/components/ui/Logo';
import { initialDummyData } from '@/lib/data';


export default function AuthPage() {
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);
  const router = useRouter();

  const handleAuth = () => {
    // In a real app, you would get the user from your API response
    const user = initialDummyData.users['vendor_user_1']; 
    setCurrentUser(user);
    if (user.role === 'VENDOR') {
      router.push('/dashboard');
    }
    // Add supplier logic here if needed
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#FDF8F0] p-4">
      <div className="text-center mb-6">
        <img src="images/initial.png" alt="Marketplace Illustration" className="w-64 mx-auto mb-4" />
        <Logo className="justify-center text-2xl" />
        <p className="text-zinc-600 mt-1">India's Digital Committee for Local Buying</p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md mx-auto">
        <div className="flex border-b mb-6">
          <button onClick={() => setAuthMode('LOGIN')} className={cn('w-1/2 py-3 font-semibold text-center transition-colors duration-300', authMode === 'LOGIN' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500')}>Login</button>
          <button onClick={() => setAuthMode('SIGNUP')} className={cn('w-1/2 py-3 font-semibold text-center transition-colors duration-300', authMode === 'SIGNUP' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500')}>Sign Up</button>
        </div>
        {authMode === 'LOGIN' ? (
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleAuth(); }}>
            <Input id="login-email" label="Email" type="email" required placeholder="you@example.com" />
            <Input id="login-password" label="Password" type="password" required placeholder="••••••••" />
            <Button type="submit" variant="primary">Login</Button>
          </form>
        ) : (
          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleAuth(); }}>
            <Input id="signup-fullname" label="Full Name (Optional)" type="text" placeholder="Raju's Chaat Stall" />
            <Input id="signup-email" label="Email" type="email" required placeholder="you@example.com" />
            <Input id="signup-locality" label="Area / Locality" type="text" required placeholder="Mhow Gaon" />
            <Input id="signup-password" label="Password" type="password" required placeholder="••••••••" />
            <Input id="signup-confirm-password" label="Confirm Password" type="password" required placeholder="••••••••" />
            <Button type="submit" variant="primary">Create Account</Button>
          </form>
        )}
      </div>
    </main>
  );
}
