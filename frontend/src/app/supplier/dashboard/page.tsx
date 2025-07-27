'use client';
import React from 'react';
import { useAppStore } from '@/stores/appStores';
import WelcomeAnimation from '@/components/features/WelcomeAnimation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// --- Supplier Dashboard Page ---
export default function SupplierDashboard() {
  const { currentUser, supplierAnalytics, myGroupBuys, isLoading, error } = useAppStore();

  if (isLoading && !supplierAnalytics) {
    return <div className="text-center p-10">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  }

  if (!currentUser) return null; // Layout handles redirect

  // Safely calculate analytics values
  const activeGroupBuysCount = supplierAnalytics?.recent_group_buys?.filter(gb => gb.status === 'ACTIVE').length ?? 0;
  const estimatedRevenue = (supplierAnalytics?.total_ordered_quantity ?? 0) * 20;

  return (
    <div className="bg-gray-50">
      <WelcomeAnimation userName={currentUser.full_name || 'Supplier'} />
      <div className="p-4 sm:p-6 pb-24 -mt-24 relative z-20">
        {/* Analytics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="text-gray-500 text-sm font-medium">Total Group Buys</h3>
            <p className="text-3xl font-bold text-gray-900">{supplierAnalytics?.total_group_buys ?? 0}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="text-gray-500 text-sm font-medium">Active Group Buys</h3>
            <p className="text-3xl font-bold text-green-600">{activeGroupBuysCount}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="text-gray-500 text-sm font-medium">Units Ordered</h3>
            <p className="text-3xl font-bold text-gray-900">{supplierAnalytics?.total_ordered_quantity ?? 0}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="text-gray-500 text-sm font-medium">Est. Revenue</h3>
            <p className="text-3xl font-bold text-gray-900">₹{estimatedRevenue}</p>
          </div>
        </div>

        {/* Actions & Group Buy List */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Your Recent Group Buys</h2>
          {/* UPDATED: Added a container for action buttons */}
          <div className="flex items-center gap-2">
            <Link 
              href="/supplier/products" 
              className="w-auto px-4 py-2 text-sm font-semibold shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-md focus:outline-none focus:ring-4 rounded-lg flex items-center justify-center bg-gray-700 text-white hover:bg-gray-800 focus:ring-gray-300"
            >
              Add Product
            </Link>
            <Link 
              href="/supplier/group/create" 
              className="w-auto px-4 py-2 text-sm font-semibold shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-md focus:outline-none focus:ring-4 rounded-lg flex items-center justify-center bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-300"
            >
              Create Group Buy
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4">
          {myGroupBuys.length === 0 ? (
            <p className="text-gray-500 text-center py-4">You haven't created any group buys yet.</p>
          ) : (
            <div className="divide-y divide-gray-200">
              {myGroupBuys.map(item => (
                <div key={item.id} className="py-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.products.name}</h3>
                    <p className="text-sm text-gray-500">{item.current_quantity} / {item.target_quantity} kg filled.</p>
                  </div>
                  <span className={cn('text-xs font-bold px-2.5 py-1 rounded-full', item.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800')}>{item.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
