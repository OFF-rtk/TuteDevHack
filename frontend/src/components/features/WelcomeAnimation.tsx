// src/components/features/WelcomeAnimation.tsx
'use client';
import React from 'react';
import { useAppStore } from '@/stores/appStores';

interface WelcomeAnimationProps {
  userName?: string;
}

export default function WelcomeAnimation({ userName }: WelcomeAnimationProps) {
  const { currentUser } = useAppStore();

  if (!currentUser) {
    // Return a fallback or null if there's no user, to prevent errors
    return null;
  }

  const isVendor = currentUser.role === 'VENDOR';
  
  // Use the passed userName prop, fallback to currentUser data, then to 'User'
  const displayName = userName || currentUser.full_name || currentUser.email || 'User';

  return (
    <div
      className={`${
        isVendor 
          ? "bg-gradient-to-r from-[#FF6B35] to-[#E55A2B]" 
          : "bg-gradient-to-r from-[#4A7C59] to-[#3D6B4A]"
      } text-white p-8 rounded-2xl mb-8 warm-shadow animate-slide-up`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-poppins font-bold mb-3 animate-fade-in">
            Hello, {displayName}! 👋
          </h1>
          <p className="text-xl opacity-90 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Your Daily Market, Delivered.
          </p>
        </div>

        <div className="hidden md:block animate-bounce-in" style={{ animationDelay: "0.4s" }}>
          <svg width="100" height="100" viewBox="0 0 100 100" className="text-white opacity-80">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8,4">
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 50 50;360 50 50"
                dur="20s"
                repeatCount="indefinite"
              />
            </circle>
            <path
              d="M30 40 L45 55 L70 30"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="50" cy="65" r="8" fill="currentColor" opacity="0.3" />
            <circle cx="35" cy="75" r="6" fill="currentColor" opacity="0.2" />
            <circle cx="65" cy="75" r="6" fill="currentColor" opacity="0.2" />
          </svg>
        </div>
      </div>
    </div>
  );
}
