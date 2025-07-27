'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/stores/appStores';
import { cn } from '@/lib/utils';
import { formatCurrency, calculateProgress } from '@/lib/utils';
import WelcomeAnimation from '@/components/features/WelcomeAnimation';
import { Button } from '@/components/ui/Button';
import type { EnrichedGroupBuy } from '@/lib/types';

// Format date utility
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Expired';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day';
  return `${diffDays} days`;
};

export default function VendorDashboard() {
  const { 
    groupBuys, 
    currentUser, 
    isLoading, 
    error, 
    fetchGroupBuys 
  } = useAppStore();

  // Fetch group buys when component mounts
  useEffect(() => {
    if (currentUser && groupBuys.length === 0) {
      fetchGroupBuys();
    }
  }, [currentUser, fetchGroupBuys, groupBuys.length]);

  if (!currentUser) {
    return null; 
  }

  // Filter active group buys
  const activeGroupBuys = groupBuys.filter((gb) => gb.status === 'ACTIVE');

  return (
    <div className="space-y-6">
      <WelcomeAnimation userName={currentUser.full_name || currentUser.email || 'Vendor'} />

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-poppins font-semibold text-[#1F2937]">
          Active Group Buys
        </h2>
        <Link href="/products">
          <Button variant="outline" size="sm">
            View All Products
          </Button>
        </Link>
      </div>

      {/* Loading State */}
      {isLoading && groupBuys.length === 0 && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading available group buys...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600">Error: {error}</p>
            <Button 
              onClick={() => fetchGroupBuys()} 
              className="mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Group Buys Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeGroupBuys.map((groupBuy, index) => (
            <GroupBuyCard 
              key={groupBuy.id} 
              groupBuy={groupBuy} 
              index={index}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && activeGroupBuys.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 opacity-50">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <path
                d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 16.1 19 15 19H9C7.9 19 7 18.1 7 17V13M17 13H7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Active Group Buys
          </h3>
          <p className="text-gray-600 mb-4">
            There are no active group buys in your area right now. Check back later for new opportunities!
          </p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function GroupBuyCard({ groupBuy, index }: { groupBuy: EnrichedGroupBuy; index: number }) {
  const { openQuantityModal } = useAppStore();
  
  const progress = calculateProgress(
    groupBuy.current_quantity, 
    groupBuy.target_quantity
  );
  
  const daysLeft = formatDate(groupBuy.end_date);

  const handleJoinGroup = () => {
    openQuantityModal(groupBuy);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Product Image */}
      <div className="aspect-square w-full mb-3 bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={groupBuy.products.image_url || "/placeholder.svg"}
          alt={groupBuy.products.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-[#1F2937] mb-1">
            {groupBuy.title || groupBuy.products.name}
          </h3>
        </div>
        <span className={cn(
          'text-xs font-bold px-2.5 py-1 rounded-full',
          groupBuy.status === 'ACTIVE' 
            ? 'bg-green-100 text-green-800' 
            : groupBuy.status === 'COMPLETED'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-gray-100 text-gray-800'
        )}>
          {groupBuy.status}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Price</span>
          <span className="font-medium text-green-600">
            {formatCurrency(groupBuy.price_per_unit)}/Kg
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-black">
              {groupBuy.current_quantity}/{groupBuy.target_quantity} Kg
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#FF6B35] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Ends in</span>
          <span className="font-medium text-[#FF6B35]">{daysLeft}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Area</span>
          <span className="font-medium text-blue-950">{groupBuy.area_name}</span>
        </div>
      </div>

      {/* Action Button */}
      <Button 
        className="w-full" 
        size="sm"
        onClick={handleJoinGroup}
        disabled={groupBuy.current_quantity >= groupBuy.target_quantity || groupBuy.status !== 'ACTIVE'}
      >
        {groupBuy.status !== 'ACTIVE' ? groupBuy.status :
         groupBuy.current_quantity >= groupBuy.target_quantity 
          ? 'Sold Out' 
          : 'Join Group Buy'
        }
      </Button>
    </div>
  );
}
