'use client';
import React, { useState } from 'react';
import { useAppStore } from '@/stores/appStores';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Input from '@/components/ui/Input';
import  Button  from '@/components/ui/Button';
import  Logo  from '@/components/ui/Logo';
import { initialDummyData } from '@/lib/data';

export default function Home() {
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);
  const router = useRouter();

  // State for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [locality, setLocality] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleAuth = () => {
    // In a real app, you would use the state variables (email, password)
    // to make an API call.
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
        <img src="http://googleusercontent.com/file_content/3" alt="Marketplace Illustration" className="w-64 mx-auto mb-4" />
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
            <Input 
              id="login-email" 
              label="Email" 
              type="email" 
              required 
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              id="login-password" 
              label="Password" 
              type="password" 
              required 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" variant="primary">Login</Button>
          </form>
        ) : (
          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleAuth(); }}>
            <Input 
              id="signup-fullname" 
              label="Full Name (Optional)" 
              type="text" 
              placeholder="Raju's Chaat Stall"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <Input 
              id="signup-email" 
              label="Email" 
              type="email" 
              required 
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              id="signup-locality" 
              label="Area / Locality" 
              type="text" 
              required 
              placeholder="Mhow Gaon"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
            />
            <Input 
              id="signup-password" 
              label="Password" 
              type="password" 
              required 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input 
              id="signup-confirm-password" 
              label="Confirm Password" 
              type="password" 
              required 
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button type="submit" variant="primary">Create Account</Button>
          </form>
        )}
      </div>
    </main>
  );
}
