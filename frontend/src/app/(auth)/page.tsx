'use client';
import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/stores/appStores';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { supabase } from '@/lib/supabaseClient';

type UserRole = 'VENDOR' | 'SUPPLIER';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    area: '',
    role: 'VENDOR' as UserRole,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setSession, setCurrentUser, session } = useAppStore();
  const router = useRouter();

  // Check if user is already authenticated
  useEffect(() => {
    if (session) {
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
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
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
        setCurrentUser({ 
          id: data.user.id,
          email: data.user.email || '',
          role: profile.role,
          full_name: profile.full_name,
          area_name: profile.area_name,
          created_at: profile.created_at,
        });

        // Role-based routing
        if (profile.role === 'SUPPLIER') {
          router.push('/supplier/dashboard');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            area_name: formData.area,
            role: formData.role,
          }
        }
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        alert('Account Created! Please check your email for verification, then log in.');
        setIsLogin(true);
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          area: '',
          role: 'VENDOR',
        });
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const fillDemoCredentials = (userEmail: string) => {
    setFormData(prev => ({
      ...prev,
      email: userEmail,
      password: 'demo123'
    }));
  };

  return (
    <div className="min-h-screen hero-gradient">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Logo className="justify-center mb-8" size="lg" />

          <h1 className="text-4xl md:text-6xl font-poppins font-bold text-[#1F2937] mb-4">India's Digital</h1>
          <h2 className="text-4xl md:text-6xl font-poppins font-bold text-[#1F2937] mb-6">Committee</h2>
          <p className="text-2xl md:text-3xl font-poppins font-semibold text-[#FF6B35] mb-8">for Local Buying</p>

          <p className="text-lg md:text-xl text-[#6B7280] max-w-2xl mx-auto mb-12 leading-relaxed">
            Connect street food vendors with suppliers. Join group buys for wholesale prices on fresh ingredients.
          </p>

          {/* Hero Image - Using your existing image */}
          <div className="max-w-sm mx-auto mb-12 animate-bounce-in">
            <div className="bg-white rounded-3xl p-6 card-shadow">
              <img
                src="/images/hero-cart.png"
                alt="Street Food Cart - Mandipur Marketplace"
                className="w-full h-auto max-w-xs mx-auto"
              />
            </div>
          </div>
        </div>

        {/* Demo Accounts Helper */}
        {isLogin && (
          <div className="max-w-md mx-auto mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
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
          </div>
        )}

        {/* Auth Form */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 warm-shadow">
            <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-4 text-center rounded-lg transition-all duration-200 font-medium ${
                  isLogin ? "bg-[#FF6B35] text-white shadow-md" : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-4 text-center rounded-lg transition-all duration-200 font-medium ${
                  !isLogin ? "bg-[#FF6B35] text-white shadow-md" : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-5">
              {!isLogin && (
                <>
                  <Input
                    label="Full Name"
                    name="name"
                    type="text"
                    placeholder='Enter your full name...'
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  
                  <Input
                    label="Area / Locality"
                    name="area"
                    type="text"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="Enter your area or locality..."
                    required
                  />
                </>
              )}

              <Input
                label="Email"
                name="email"
                type="email"
                placeholder='Enter your email...'
                value={formData.email}
                onChange={handleInputChange}
                required
              />

              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                placeholder='**********'
                onChange={handleInputChange}
                required
              />

              {!isLogin && (
                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  placeholder='**********'
                  onChange={handleInputChange}
                  required
                />
              )}

              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                {isLogin ? "Login" : "Sign Up"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
