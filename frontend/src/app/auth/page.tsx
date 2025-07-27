'use client';
import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/stores/appStores';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Logo from '@/components/ui/Logo';
import { supabase } from '@/lib/supabaseClient'; // Import the clean client
import Image from 'next/image';

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const { setSession, setCurrentUser, session } = useAppStore();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [areaName, setAreaName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      // Redirect based on role after session is confirmed
      const userRole = useAppStore.getState().currentUser?.role;
      if (userRole === 'SUPPLIER') {
        router.push('/supplier/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [session, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data.session && data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) throw profileError;

        setSession(data.session);
        setCurrentUser({ ...data.user, ...profile });

        // THE FIX: Check for 'SUPPLIER' instead of 'wholesaler'
        if (profile.role === 'SUPPLIER') {
          router.push('/supplier/dashboard');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            area_name: areaName,
          }
        }
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        alert('Account Created! Please log in.');
        setAuthMode('LOGIN');
        clearForm();
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during signup.');
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setAreaName('');
    setError(null);
  };

  const fillDemoCredentials = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('demo123');
  };

  // --- JSX for the component ---
  return (
    <main className="min-h-screen bg-[#9fe2f7] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mb-6">
            <Image 
              src="/images/initial.png" 
              alt="Marketplace Illustration" 
              width={512}
              height={256} 
              className="mx-auto"
              priority
            />
          </div>
          <Logo className="justify-center text-2xl mb-2" />
          <p className="text-gray-600">India's Digital Committee for Local Buying</p>
        </div>

        {authMode === 'LOGIN' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">🎭 Demo Accounts</h3>
            <div className="space-y-2">
              <button 
                onClick={() => fillDemoCredentials('raju.stall@mandinow.demo')}
                className="block w-full text-left text-xs text-blue-700 hover:text-blue-900 hover:bg-blue-100 p-2 rounded"
              >
                📍 Vendor: raju.stall@mandinow.demo
              </button>
              <button 
                onClick={() => fillDemoCredentials('krishna.farms@mandinow.demo')}
                className="block w-full text-left text-xs text-blue-700 hover:text-blue-900 hover:bg-blue-100 p-2 rounded"
              >
                🌾 Supplier: krishna.farms@mandinow.demo
              </button>
            </div>
            <p className="text-xs text-blue-600 mt-2">Password: demo123</p>
          </div>
        )}

        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {authMode === 'LOGIN' ? 'Welcome Back' : 'Join MandiNow'}
            </h2>
            <p className="text-gray-500 text-sm">
              {authMode === 'LOGIN' 
                ? 'Sign in to access your dashboard' 
                : 'Create your account to get started'
              }
            </p>
          </div>

          <div className="flex bg-gray-50 rounded-xl p-1 mb-6">
            <button 
              onClick={() => { setAuthMode('LOGIN'); clearForm(); }} 
              className={cn('w-1/2 py-3 px-4 font-semibold text-center rounded-lg transition-all duration-300', authMode === 'LOGIN' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700')}
            >
              Login
            </button>
            <button 
              onClick={() => { setAuthMode('SIGNUP'); clearForm(); }} 
              className={cn('w-1/2 py-3 px-4 font-semibold text-center rounded-lg transition-all duration-300', authMode === 'SIGNUP' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700')}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                {error}
              </div>
            </div>
          )}

          {authMode === 'LOGIN' ? (
            <form className="space-y-6" onSubmit={handleLogin}>
              <Input id="login-email" label="Email" type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input id="login-password" label="Password" type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Button type="submit" variant="primary" disabled={loading} className="w-full flex items-center justify-center space-x-2">
                {loading && (<svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>)}
                <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              </Button>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleSignUp}>
              <Input id="signup-fullname" label="Full Name (Optional)" type="text" placeholder="Raju's Chaat Stall" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              <Input id="signup-email" label="Email" type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input id="signup-locality" label="Area / Locality" type="text" required placeholder="Mhow Gaon" value={areaName} onChange={(e) => setAreaName(e.target.value)} />
              <Input id="signup-password" label="Password" type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Input id="signup-confirm-password" label="Confirm Password" type="password" required placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              <Button type="submit" variant="primary" disabled={loading} className="w-full flex items-center justify-center space-x-2">
                {loading && (<svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>)}
                <span>{loading ? "Creating Account..." : "Create Account"}</span>
              </Button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}