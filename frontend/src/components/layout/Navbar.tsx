'use client';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import  Logo  from '@/components/ui/Logo';
import { User } from '@/lib/types';

interface NavbarProps {
    user: User;
    handleLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, handleLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const userInitial = user.full_name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase();

    const navLinks = user.role === 'VENDOR' ? [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Products', href: '/products' },
        { label: 'My Orders', href: '/my-orders' },
    ] : [
        { label: 'Dashboard', href: '/supplier-dashboard' },
    ];

    return (
        <nav className="bg-white/90 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Logo />
                    </div>
                    <div className="flex items-center">
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-1">
                                {navLinks.map(link => (
                                    <Link 
                                        key={link.href} 
                                        href={link.href} 
                                        className={cn(
                                            'px-3 py-2 rounded-md text-sm font-medium transition-colors', 
                                            pathname === link.href 
                                                ? 'bg-orange-100 text-orange-600' 
                                                : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="hidden md:block ml-4 relative">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {userInitial}
                            </button>
                            {isMenuOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-40">
                                    <div className="px-4 py-3">
                                        <p className="text-sm text-gray-700 font-semibold truncate">{user.full_name || user.email}</p>
                                        <p className="text-xs text-gray-500">{user.role}</p>
                                    </div>
                                    <div className="border-t border-gray-100"></div>
                                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Logout</button>
                                </div>
                            )}
                        </div>
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700">
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={!isMenuOpen ? "M4 6h16M4 12h16M4 18h16" : "M6 18L18 6M6 6l12 12"} /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map(link => (
                             <Link 
                                key={link.href} 
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={cn(
                                    'block px-3 py-2 rounded-md text-base font-medium', 
                                    pathname === link.href 
                                        ? 'bg-orange-100 text-orange-600' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    <div className="pt-4 pb-3 border-t border-gray-200">
                        <div className="flex items-center px-5">
                            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold text-lg">{userInitial}</div>
                            <div className="ml-3">
                                <div className="text-base font-medium text-gray-800">{user.full_name || user.email}</div>
                                <div className="text-sm font-medium text-gray-500">{user.role}</div>
                            </div>
                        </div>
                        <div className="mt-3 px-2 space-y-1">
                            <button onClick={handleLogout} className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50">Logout</button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};
