// src/components/ui/Button.tsx
import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
    isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', isLoading = false, ...props }) => {
    const baseClasses = "w-full py-3 px-5 text-base font-semibold shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-md focus:outline-none focus:ring-4 rounded-lg flex items-center justify-center";
    const variantClasses = {
        primary: 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-300',
        secondary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-300',
        danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-300',
    };
    return (
        <button className={cn(baseClasses, variantClasses[variant], (isLoading || props.disabled) && 'opacity-60 cursor-not-allowed', className)} {...props} disabled={isLoading || props.disabled}>
            {isLoading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
            {children}
        </button>
    );
};

export default Button;