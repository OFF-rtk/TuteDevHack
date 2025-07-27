// src/components/ui/Logo.tsx
import React from 'react';
import { cn } from '../../lib/utils';

const Logo: React.FC<{ className?: string }> = ({ className }) => (
    <div className={cn("flex items-center space-x-2", className)}>
        <svg className="w-8 h-8 text-orange-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5 9.5C17.5 11.433 15.933 13 14 13C12.067 13 10.5 11.433 10.5 9.5C10.5 7.567 12.067 6 14 6C15.933 6 17.5 7.567 17.5 9.5Z" fill="#FDBA74"/>
            <path d="M9.5 9.5C9.5 11.433 7.933 13 6 13C4.067 13 2.5 11.433 2.5 9.5C2.5 7.567 4.067 6 6 6C7.933 6 9.5 7.567 9.5 9.5Z" fill="#FDBA74"/>
            <path d="M19.9829 14.7821C20.2084 15.343 19.8824 15.9823 19.3215 16.2078L13.9997 18.2078C13.4388 18.4333 12.7995 18.1073 12.574 17.5464C12.3485 16.9855 12.6745 16.3462 13.2354 16.1207L18.5572 14.1207C19.1181 13.8952 19.7574 14.2212 19.9829 14.7821Z" fill="#4ADE80"/>
            <path d="M4.01707 14.7821C3.79159 15.343 4.11763 15.9823 4.67854 16.2078L10.0003 18.2078C10.5612 18.4333 11.2005 18.1073 11.426 17.5464C11.6515 16.9855 11.3255 16.3462 10.7646 16.1207L5.44278 14.1207C4.88187 13.8952 4.24255 14.2212 4.01707 14.7821Z" fill="#4ADE80"/>
        </svg>
        <div className="text-xl font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <span className="text-orange-600">M</span><span className="text-zinc-800">andipur</span>
        </div>
    </div>
);

export default Logo;