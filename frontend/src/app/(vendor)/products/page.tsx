'use client';
import React, { useState } from 'react';
import { useAppStore } from '@/stores/appStores';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function ProductsPage() {
  // Get live data and UI state from the Zustand store
  const { groupBuys, isLoading, error } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter the live groupBuys data
  const filteredGroupBuys = groupBuys.filter(gb => 
    gb.products.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading && groupBuys.length === 0) {
    return <div className="text-center p-10">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 sm:p-6 pb-24 bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-800 mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
        Available Products
      </h2>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search for products in your area..."
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 bg-white border text-black border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredGroupBuys.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow-md transition-shadow hover:shadow-lg animate-fade-in">
            {/* CORRECTED: Accessing nested 'products' object */}
            <img src={item.products.image_url} alt={item.products.name} className="w-full h-24 object-cover rounded-t-lg" />
            <div className="p-3">
              <h3 className="font-semibold text-gray-900 truncate">{item.products.name}</h3>
              {/* CORRECTED: Using a sensible default for unit */}
              <p className="text-sm text-green-600 font-bold">₹{item.price_per_unit}/kg</p>
              {/* CORRECTED: Using Next.js Link for navigation */}
              <Link href={`/group/${item.id}`} passHref>
                <Button className="mt-3 text-sm py-2 h-auto w-full">View Group Buy</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
