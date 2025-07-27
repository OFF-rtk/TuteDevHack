// src/app/dashboard/page.tsx
'use client';
import React from 'react';
import { useAppStore } from '@/stores/appStores';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';
import WelcomeAnimation from '@/components/features/WelcomeAnimation';
import Link from 'next/link';

// --- Vendor Dashboard Page ---
export default function VendorDashboard() {
  const { groupBuys, currentUser, isLoading, error } = useAppStore();

  if (isLoading && groupBuys.length === 0) {
    return <div className="text-center p-10">Loading available group buys...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  }
  
  if (!currentUser) {
    return null; 
  }

  return (
    <div>
      <WelcomeAnimation userName={currentUser.full_name || currentUser.email || 'Vendor'} />
      <div className="p-4 sm:p-6 pb-24 -mt-24 relative z-20">
        {groupBuys.length === 0 && !isLoading ? (
          <div className="text-center bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold">No Active Group Buys</h3>
            <p className="text-gray-500 mt-2">There are no active group buys in your area right now. Please check back later!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupBuys.map((item, index) => (
              <div key={item.id} className="bg-white rounded-xl p-4 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <img src={item.products?.image_url} alt={item.products?.name} className="w-full h-40 object-cover rounded-lg mb-4" />
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{item.products?.name || 'Product Name'}</h3>
                    <p className="text-sm text-gray-500">Target Price: <span className="font-bold text-green-600">₹{item.price_per_unit}/kg</span></p>
                  </div>
                  <span className={cn('text-xs font-bold px-2.5 py-1 rounded-full', item.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800')}>{item.status}</span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{item.current_quantity} kg</span>
                    <span>{item.target_quantity} kg</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(item.current_quantity / item.target_quantity) * 100}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    {/* THE FIX: Use optional chaining to safely access the supplier's name */}
                    <span>By: {item.profiles?.full_name || 'Unknown Supplier'}</span>
                    <span>Ends: {formatDate(item.end_date)}</span>
                  </div>
                </div>
                <Link 
                  href={`/group/${item.id}`} 
                  className="w-full py-2.5 px-5 text-base font-semibold shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-lg active:shadow-md focus:outline-none focus:ring-4 rounded-lg flex items-center justify-center bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-300 mt-5"
                >
                  View Details & Join
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};