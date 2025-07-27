'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/stores/appStores';
import WelcomeAnimation from '@/components/features/WelcomeAnimation';
import { Button } from '@/components/ui/Button';
import { cn, formatCurrency, calculateProgress } from '@/lib/utils';
import type { EnrichedGroupBuy } from '@/lib/types';

export default function SupplierDashboard() {
  const { 
    currentUser, 
    supplierAnalytics, 
    myGroupBuys, 
    isLoading, 
    error,
    fetchSupplierAnalytics,
    fetchMyGroupBuys,
    fetchMyProducts
  } = useAppStore();

  // Fetch data when component mounts
  useEffect(() => {
    if (currentUser) {
      fetchSupplierAnalytics();
      fetchMyGroupBuys();
      fetchMyProducts();
    }
  }, [currentUser, fetchSupplierAnalytics, fetchMyGroupBuys, fetchMyProducts]);

  if (isLoading && !supplierAnalytics) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A7C59] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600">Error: {error}</p>
          <Button 
            onClick={() => {
              fetchSupplierAnalytics();
              fetchMyGroupBuys();
            }} 
            className="mt-4"
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!currentUser) return null; // Layout handles redirect

  // Calculate stats from your actual data
  const activeGroupBuysCount = myGroupBuys.filter(gb => gb.status === 'ACTIVE').length;
  const totalOrders = supplierAnalytics?.total_ordered_quantity ?? 0;
  const estimatedRevenue = totalOrders * 20; // Or use actual revenue calculation

  const stats = [
    { 
      label: "Total Group Buys", 
      value: supplierAnalytics?.total_group_buys ?? 0, 
      color: "bg-blue-50 text-blue-600" 
    },
    { 
      label: "Active Group Buys", 
      value: activeGroupBuysCount, 
      color: "bg-green-50 text-green-600" 
    },
    { 
      label: "Units Ordered", 
      value: totalOrders, 
      color: "bg-yellow-50 text-yellow-600" 
    },
    { 
      label: "Est. Revenue", 
      value: formatCurrency(estimatedRevenue), 
      color: "bg-purple-50 text-purple-600" 
    },
  ];

  return (
    <div className="space-y-6">
      <WelcomeAnimation userName={currentUser.full_name || 'Supplier'} />

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.color} rounded-lg p-4 text-center`}>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Actions & Group Buy List */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-poppins font-semibold text-[#1F2937]">My Group Buys</h2>
        <div className="flex items-center gap-2">
          <Link href="/supplier/products">
            <Button 
            variant="outline" 
            size="sm" 
            className="border-[#4A7C59] text-[#4A7C59] hover:bg-[#4A7C59]/5 hover:text-[#4A7C59] focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:ring-offset-2"
            >
            Manage Products
            </Button>
          </Link>
          <Link href="/supplier/group/create">
            <Button variant="secondary">
              Create New
            </Button>
          </Link>
        </div>
      </div>

      {/* Group Buys List */}
      <div className="space-y-4">
        {myGroupBuys.map((groupBuy) => (
          <SupplierGroupBuyCard key={groupBuy.id} groupBuy={groupBuy} />
        ))}
      </div>

      {/* Empty State */}
      {myGroupBuys.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 opacity-50">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-[#4A7C59]">
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Group Buys Yet</h3>
          <p className="text-gray-600 mb-4">Create your first group buy to start selling</p>
          <Link href="/supplier/group/create">
            <Button variant="secondary">Create Group Buy</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function SupplierGroupBuyCard({ groupBuy }: { groupBuy: EnrichedGroupBuy }) {
  const progress = calculateProgress(groupBuy.current_quantity, groupBuy.target_quantity);
  const timeLeft = new Date(groupBuy.end_date).getTime() - Date.now();
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-600 bg-green-50";
      case "COMPLETED":
        return "text-blue-600 bg-blue-50";
      case "CANCELLED":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex gap-4">
        {/* Fixed image placeholder with explicit green colors */}
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 border-dashed border-green-300 bg-green-50">
          {groupBuy.products.image_url ? (
            <img
              src={groupBuy.products.image_url}
              alt={groupBuy.products.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-green-50">
              <svg 
                className="w-6 h-6 text-green-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
                />
              </svg>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-[#1F2937]">
              {groupBuy.title || groupBuy.products.name}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(groupBuy.status)}`}>
              {groupBuy.status}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Price</p>
              <p className="font-medium text-green-600">
                {formatCurrency(groupBuy.price_per_unit)}/unit
              </p>
            </div>
            <div>
              <p className="text-gray-600">Progress</p>
              <p className="font-medium text-black">
                {groupBuy.current_quantity}/{groupBuy.target_quantity}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Area</p>
              <p className="font-medium text-blue-950">{groupBuy.area_name}</p>
            </div>
            <div>
              <p className="text-gray-600">Days Left</p>
              <p className="font-medium text-red-600">{Math.max(0, daysLeft)}</p>
            </div>
          </div>

          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{progress.toFixed(1)}% complete</p>
          </div>
        </div>
      </div>
    </div>
  );
}
