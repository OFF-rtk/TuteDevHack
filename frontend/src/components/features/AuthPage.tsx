// src/components/features/AuthPage.tsx
import React, { useState } from 'react';
import { User } from '../../types';
import { initialDummyData } from '../../lib/data';
import { cn } from '../../lib/utils';
import Logo from '../ui/Logo';
import Input from '../ui/Input';
import Button from '../ui/Button';

const AuthPage: React.FC<{ handleAuth: (user: User) => void }> = ({ handleAuth }) => {
    const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
    // Dummy login/signup logic
    const onLogin = () => handleAuth(initialDummyData.users['vendor_user_1']);
    const onSignup = () => handleAuth(initialDummyData.users['vendor_user_1']);

    return (
        <div className="p-4 flex flex-col justify-center min-h-screen bg-[#FDF8F0]">
            <div className="text-center mb-6">
                 <img src="https://i.imgur.com/gB4JZGg.png" alt="Marketplace Illustration" className="w-64 mx-auto mb-4" />
                <Logo className="justify-center text-2xl"/>
                <p className="text-zinc-600 mt-1">India's Digital Committee for Local Buying</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md mx-auto">
                <div className="flex border-b mb-6">
                    <button onClick={() => setAuthMode('LOGIN')} className={cn('w-1/2 py-3 font-semibold text-center transition-colors duration-300', authMode === 'LOGIN' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500')}>Login</button>
                    <button onClick={() => setAuthMode('SIGNUP')} className={cn('w-1/2 py-3 font-semibold text-center transition-colors duration-300', authMode === 'SIGNUP' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500')}>Sign Up</button>
                </div>
                {authMode === 'LOGIN' ? (
                    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                        <Input id="login-email" label="Email" type="email" required placeholder="you@example.com" />
                        <Input id="login-password" label="Password" type="password" required placeholder="••••••••" />
                        <Button type="submit" variant="primary">Login</Button>
                    </form>
                ) : (
                    <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onSignup(); }}>
                        <Input id="signup-fullname" label="Full Name (Optional)" type="text" placeholder="Raju's Chaat Stall" />
                        <Input id="signup-email" label="Email" type="email" required placeholder="you@example.com" />
                        <Input id="signup-locality" label="Area / Locality" type="text" required placeholder="Mhow Gaon" />
                        <Input id="signup-password" label="Password" type="password" required placeholder="••••••••" />
                        <Input id="signup-confirm-password" label="Confirm Password" type="password" required placeholder="••••••••" />
                        <Button type="submit" variant="primary">Create Account</Button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AuthPage;