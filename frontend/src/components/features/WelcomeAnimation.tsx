// src/components/features/WelcomeAnimation.tsx
import React from 'react';

const WelcomeAnimation: React.FC<{ userName: string }> = ({ userName }) => {
  // Function to get a greeting based on the time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="bg-[#FDF8F0] z-10 flex flex-col items-center justify-start pt-16 p-8 text-center min-h-[50vh]">
      <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        <h1 className="text-3xl font-bold text-zinc-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {getGreeting()}, {userName}!
        </h1>
      </div>
      <div className="animate-fade-in-up" style={{ animationDelay: '1.8s' }}>
        <p className="text-lg text-zinc-600 mt-2">Your Daily Market, Delivered.</p>
      </div>
      <div className="relative w-80 h-80 mt-8 animate-fade-in-up" style={{ animationDelay: '3s' }}>
        <img src="https://i.imgur.com/gB4JZGg.png" alt="Welcome Illustration" className="w-full h-full object-contain" />
      </div>
    </div>
  );
};

export default WelcomeAnimation;
