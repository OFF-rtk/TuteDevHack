'use client';
import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/stores/appStores';
import { formatDate, formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import type { EnrichedOrder } from '@/lib/types';

export default function MyOrdersPage() {
  const { 
    myOrders, 
    isLoading, 
    error, 
    cancelOrder, 
    openConfirmModal,
    fetchMyOrders,
    currentUser 
  } = useAppStore();

  // Fetch orders when component mounts
  useEffect(() => {
    if (currentUser && myOrders.length === 0) {
      fetchMyOrders();
    }
  }, [currentUser, fetchMyOrders, myOrders.length]);

  if (isLoading && myOrders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600">Error: {error}</p>
          <Button 
            onClick={() => fetchMyOrders()} 
            className="mt-4"
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-poppins font-bold text-[#1F2937] mb-2">My Orders</h1>
        <p className="text-gray-600">Track your group buy orders</p>
      </div>

      <div className="space-y-4">
        {myOrders.filter(Boolean).map((order) => (
          <OrderCard 
            key={order.id} 
            order={order} 
            onCancel={cancelOrder}
            onConfirm={openConfirmModal}
          />
        ))}
      </div>

      {myOrders.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 opacity-50">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <path
                d="M16 4H18C19.1 4 20 4.9 20 6V18C20 19.1 19.1 20 18 20H6C4.9 20 4 19.1 4 18V6C4 4.9 4.9 4 6 4H8M16 4V2M8 4V2M8 4H16M8 4H16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
          <p className="text-gray-600">Your orders will appear here once you join group buys</p>
        </div>
      )}
    </div>
  );
}

function OrderCard({
  order,
  onCancel,
  onConfirm,
}: {
  order: EnrichedOrder;
  onCancel: (id: string) => Promise<void>;
  onConfirm: (title: string, message: string, callback: () => void) => void;
}) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (order.status !== "PLACED") return;

    const orderTime = new Date(order.created_at).getTime();
    const thirtyMinutes = 30 * 60 * 1000;
    const expiryTime = orderTime + thirtyMinutes;

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, expiryTime - now);
      setTimeLeft(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [order]);

  const canCancel = order.status === "PLACED" && timeLeft > 0;
  const minutes = Math.floor(timeLeft / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const handleCancel = () => {
    onConfirm(
      "Cancel Order", 
      "Are you sure you want to cancel this order? This action cannot be undone.", 
      () => onCancel(order.id)
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLACED":
        return "text-yellow-600 bg-yellow-50";
      case "PENDING":
        return "text-blue-600 bg-blue-50";
      case "DELIVERED":
        return "text-green-600 bg-green-50";
      case "CANCELLED":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={order.products.image_url}
            alt={order.products.name || 'Product Image'}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-[#1F2937] mb-1">
            {order.products?.name || 'Product Unavailable'}
          </h3>
          <p className="text-sm text-green-600 mb-2">
            Quantity: {order.quantity} Kg
          </p>
          <p className="text-xs text-gray-500 mb-2">
            Ordered on: {formatDate(order.created_at)}
          </p>

          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Order #{order.id.slice(-8)}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>

          {canCancel && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Cancel within: {minutes}:{seconds.toString().padStart(2, "0")}
              </div>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel Order
              </Button>
            </div>
          )}

          {order.status === "DELIVERED" && (
            <div className="text-sm text-green-600 font-medium">
              ✓ Order completed successfully
            </div>
          )}

          {order.status === "CANCELLED" && (
            <div className="text-sm text-red-600">
              Order was cancelled
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
