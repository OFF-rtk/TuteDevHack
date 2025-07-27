'use client';
import React from 'react';
import { useAppStore } from '@/stores/appStores';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// --- My Orders Page ---
export default function MyOrdersPage() {
  // Get the live data and UI state from the Zustand store
  const { myOrders, isLoading, error } = useAppStore();

  if (isLoading && myOrders.length === 0) {
    return <div className="text-center p-10">Loading your orders...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">My Orders</h1>
      
      {myOrders.length === 0 && !isLoading ? (
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <Image 
            src="/images/empty-box.png" // Replace with a relevant illustration
            alt="No orders found"
            width={128}
            height={128}
            className="mx-auto mb-4"
          />
          <h3 className="text-lg font-semibold">No Orders Yet</h3>
          <p className="text-gray-500 mt-2">You haven't placed any orders. Join a group buy from the dashboard to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Added a filter to prevent rendering null/undefined orders */}
          {myOrders.filter(Boolean).map(order => (
            <div key={order.id} className="bg-white rounded-xl p-4 shadow-md transition-shadow hover:shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Image 
                  // FIXED: Use optional chaining and provide a fallback image
                  src={order?.products?.image_url || '/images/placeholder.png'} 
                  alt={order?.products?.name || 'Product Image'}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      {/* FIXED: Use optional chaining and provide a fallback name */}
                      <h3 className="font-semibold text-md text-gray-900">{order?.products?.name || 'Product Unavailable'}</h3>
                      <p className="text-sm text-gray-600">
                        Quantity: <span className="font-bold">{order.quantity} kg</span> {/* Assuming kg */}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Ordered on: {formatDate(order.created_at)}
                      </p>
                    </div>
                    <span 
                      className={cn(
                        'text-xs font-bold px-2.5 py-1 rounded-full', 
                        order.status === 'PLACED' ? 'bg-yellow-100 text-yellow-800' : 
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 
                        'bg-gray-100 text-gray-800'
                      )}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
