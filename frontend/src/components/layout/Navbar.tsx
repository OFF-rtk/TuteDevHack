'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import { User } from '@/lib/types';

interface NavbarProps {
    user: User;
    handleLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, handleLogout }) => {
    const router = useRouter();
    const pathname = usePathname();
    
    const isVendor = user.role === 'VENDOR';
    const dashboardPath = isVendor ? '/dashboard' : '/supplier/dashboard';

    const navLinks = isVendor ? [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Products', href: '/products' },
        { label: 'My Orders', href: '/my-orders' },
    ] : [
        { label: 'Dashboard', href: '/supplier/dashboard' },
        { label: 'Create Group Buy', href: '/supplier/group/create' },
    ];

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Logo size="sm" />

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-[#6B7280] hidden sm:block">
                            Welcome, {user.full_name || user.email}
                        </span>
                        <Button variant="ghost" onClick={handleLogout} size="sm">
                            Logout
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile/Desktop Navigation */}
            <div className="bg-white/60 backdrop-blur-sm border-t border-gray-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8 overflow-x-auto py-3">
                        {navLinks.map(link => (
                            <NavLink 
                                key={link.href}
                                href={link.href} 
                                label={link.label} 
                                isVendor={isVendor}
                                isActive={pathname === link.href}
                                onClick={() => router.push(link.href)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};

interface NavLinkProps {
    href: string;
    label: string;
    isVendor: boolean;
    isActive: boolean;
    onClick: () => void;
}

function NavLink({ href, label, isVendor, isActive, onClick }: NavLinkProps) {
    const hoverColor = isVendor
        ? "hover:text-[#FF6B35] hover:border-[#FF6B35]"
        : "hover:text-[#4A7C59] hover:border-[#4A7C59]";
    
    const activeColor = isVendor
        ? "text-[#FF6B35] border-[#FF6B35]"
        : "text-[#4A7C59] border-[#4A7C59]";

    return (
        <button
            onClick={onClick}
            className={cn(
                "whitespace-nowrap py-2 px-1 text-sm font-medium transition-colors border-b-2",
                isActive 
                    ? `${activeColor}` 
                    : `text-[#6B7280] border-transparent ${hoverColor}`
            )}
        >
            {label}
        </button>
    );
}
