'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/stores/appStores';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency, calculateProgress } from '@/lib/utils';
import type { EnrichedGroupBuy } from '@/lib/types';

export default function ProductsPage() {
  const { 
    groupBuys, 
    isLoading, 
    error, 
    fetchGroupBuys,
    currentUser 
  } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch group buys when component mounts
  useEffect(() => {
    if (currentUser && groupBuys.length === 0) {
      fetchGroupBuys();
    }
  }, [currentUser, fetchGroupBuys, groupBuys.length]);

  // Filter for active group buys and search term
  const filteredGroupBuys = groupBuys.filter(gb => 
    gb.status === 'ACTIVE' && 
    gb.products.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading && groupBuys.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-poppins font-bold text-[#1F2937] mb-2">
          Available Products
        </h1>
        <p className="text-gray-600">Browse and join group buys for bulk purchasing</p>
      </div>

      <div className="max-w-md">
        <Input 
          placeholder="Search products..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGroupBuys.map((groupBuy) => (
          <ProductCard key={groupBuy.id} groupBuy={groupBuy} />
        ))}
      </div>

      {filteredGroupBuys.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 opacity-50">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <path
                d="M21 21L16.65 16.65"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search terms' : 'No active group buys available right now'}
          </p>
        </div>
      )}
    </div>
  );
}

function ProductCard({ groupBuy }: { groupBuy: EnrichedGroupBuy }) {
  const progress = calculateProgress(groupBuy.current_quantity, groupBuy.target_quantity);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={groupBuy.products.image_url || "/placeholder.svg"}
            alt={groupBuy.products.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-[#1F2937] mb-1">
            {groupBuy.title || groupBuy.products.name}
          </h3>

          <div className="space-y-1 mb-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Price</span>
              <span className="font-medium text-green-600">
                {formatCurrency(groupBuy.price_per_unit)}/Kg
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-[#FF6B35] h-1.5 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(progress, 100)}%` }} 
              />
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <span>
                {groupBuy.current_quantity}/{groupBuy.target_quantity} Kg
              </span>
              <span>{groupBuy.area_name}</span>
            </div>
          </div>

          <Link href={`/group/${groupBuy.id}`}>
            <Button size="sm" className="w-full">
              View Group Buy
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
