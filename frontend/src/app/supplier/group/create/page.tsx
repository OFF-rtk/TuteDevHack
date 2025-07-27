'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/stores/appStores';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CreateGroupBuyDto } from '@/lib/types';

export default function CreateGroupBuyPage() {
  const { 
    myProducts, 
    fetchMyProducts, 
    createGroupBuy, 
    isLoading,
    currentUser,
    openAlertModal
  } = useAppStore();
  const router = useRouter();

  // Form state matching your CreateGroupBuyDto
  const [formData, setFormData] = useState<Partial<CreateGroupBuyDto>>({
    product_id: '',
    title: '',
    end_date: '',
    target_quantity: 100,
    area_name: '',
    price_per_unit: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch the supplier's products when the component mounts
  useEffect(() => {
    if (currentUser) {
      fetchMyProducts();
    }
  }, [currentUser, fetchMyProducts]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price_per_unit' || name === 'target_quantity' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.product_id || !formData.end_date || !formData.area_name || !formData.price_per_unit) {
      setError('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createGroupBuy(formData as CreateGroupBuyDto);
      openAlertModal('Success', 'Group buy created successfully!');
      router.push('/supplier/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create group buy.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set minimum date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateTime = tomorrow.toISOString().slice(0, 16); // Format for datetime-local

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <div className="max-w-2xl mx-auto space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-poppins font-bold text-[#1F2937] mb-2">
            Create New Group Buy
          </h1>
          <p className="text-[#6B7280]">
            Set up a new group buying opportunity for vendors
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 warm-shadow">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Selection */}
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">
                Product
              </label>
              {isLoading && myProducts.length === 0 ? (
                <p className="text-[#6B7280]">Loading your products...</p>
              ) : (
                <select
                  name="product_id"
                  value={formData.product_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-[#4A7C59] transition-colors bg-white text-[#1F2937]"
                  required
                >
                  <option value="" className="text-[#6B7280]">Select a product</option>
                  {myProducts.map((product) => (
                    <option key={product.id} value={product.id} className="text-[#1F2937]">
                      {product.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">
                End Date
              </label>
              <input
                name="end_date"
                type="datetime-local"
                value={formData.end_date || ''}
                onChange={handleInputChange}
                min={minDateTime}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-[#4A7C59] transition-colors bg-white text-[#1F2937]"
                required
              />
            </div>

            {/* Target Quantity */}
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">
                Target Quantity (units)
              </label>
              <input
                name="target_quantity"
                type="number"
                value={formData.target_quantity || ''}
                onChange={handleInputChange}
                min="1"
                placeholder="e.g., 100"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-[#4A7C59] transition-colors bg-white text-[#1F2937] placeholder-[#6B7280]"
                required
              />
            </div>

            {/* Area */}
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">
                Delivery Area
              </label>
              <input
                name="area_name"
                type="text"
                value={formData.area_name || ''}
                onChange={handleInputChange}
                placeholder="e.g., Mhow Gaon"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-[#4A7C59] transition-colors bg-white text-[#1F2937] placeholder-[#6B7280]"
                required
              />
            </div>

            {/* Price per Unit */}
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">
                Price per Unit (₹)
              </label>
              <input
                name="price_per_unit"
                type="number"
                step="0.01"
                value={formData.price_per_unit || ''}
                onChange={handleInputChange}
                min="0"
                placeholder="e.g., 25.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-[#4A7C59] transition-colors bg-white text-[#1F2937] placeholder-[#6B7280]"
                required
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button" 
                onClick={() => router.back()} 
                className="flex-1 py-3 px-4 text-center rounded-lg transition-all duration-200 font-medium text-[#6B7280] hover:text-[#1F2937] hover:bg-gray-100 border border-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit" 
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 text-center rounded-lg transition-all duration-200 font-medium bg-[#4A7C59] text-white hover:bg-[#3D6B4A] focus:outline-none focus:ring-2 focus:ring-[#4A7C59] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  'Create Group Buy'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
