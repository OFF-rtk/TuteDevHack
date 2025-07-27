'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/stores/appStores';
import { CreateProductDto } from '@/lib/types';

export default function CreateProductPage() {
  const { createProduct, isLoading, openAlertModal } = useAppStore();
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<CreateProductDto>({
    name: '',
    description: '',
    image_url: '',
    search_keywords: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Product name is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createProduct(formData);
      openAlertModal('Success', 'Your new product has been created successfully!');
      router.push('/supplier/products');
    } catch (err: any) {
      setError(err.message || 'Failed to create product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <div className="max-w-2xl mx-auto space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-poppins font-bold text-[#1F2937] mb-2">
            Add New Product
          </h1>
          <p className="text-[#6B7280]">
            Create a new product to use in your group buys
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 warm-shadow">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">
                Product Name
              </label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Premium Fresh Onions"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-[#4A7C59] transition-colors bg-white text-[#1F2937] placeholder-[#4A7C59]"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                placeholder="e.g., Top grade white onions, handpicked for quality and freshness"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-[#4A7C59] transition-colors bg-white text-[#1F2937] placeholder-[#4A7C59] resize-none"
                rows={3}
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">
                Product Image URL (Optional)
              </label>
              <input
                name="image_url"
                type="url"
                value={formData.image_url || ''}
                onChange={handleInputChange}
                placeholder="https://example.com/product-image.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-[#4A7C59] transition-colors bg-white text-[#1F2937] placeholder-[#4A7C59]"
              />
            </div>

            {/* Search Keywords */}
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">
                Search Keywords (Optional)
              </label>
              <input
                name="search_keywords"
                type="text"
                value={formData.search_keywords || ''}
                onChange={handleInputChange}
                placeholder="e.g., onions, safed, pyaz, premium, fresh"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-[#4A7C59] transition-colors bg-white text-[#1F2937] placeholder-[#4A7C59]"
              />
              <p className="text-xs text-[#4A7C59] mt-1">
                Separate keywords with commas to help vendors find your product
              </p>
            </div>

            {/* Image Preview */}
            {formData.image_url && (
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-2">
                  Image Preview
                </label>
                <div className="w-32 h-32 bg-green-50 rounded-lg overflow-hidden border-2 border-dashed border-green-300">
                  <img
                    src={formData.image_url}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}

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
                disabled={isSubmitting || isLoading}
                className="flex-1 py-3 px-4 text-center rounded-lg transition-all duration-200 font-medium bg-[#4A7C59] text-white hover:bg-[#3D6B4A] focus:outline-none focus:ring-2 focus:ring-[#4A7C59] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  'Create Product'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
