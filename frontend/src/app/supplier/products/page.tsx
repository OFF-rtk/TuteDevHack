'use client';
import React, { useEffect } from 'react';
import { useAppStore } from '@/stores/appStores';
import Link from 'next/link';
import Image from 'next/image';
import { PlusCircle, Trash2, Edit, Package } from 'lucide-react';

export default function MyProductsPage() {
  const { 
    myProducts, 
    isLoading, 
    error, 
    fetchMyProducts,
    deleteProduct,
    openConfirmModal,
    currentUser
  } = useAppStore();

  useEffect(() => {
    if (currentUser) {
      fetchMyProducts();
    }
  }, [currentUser, fetchMyProducts]);

  const handleDelete = (productId: string, productName: string) => {
    openConfirmModal(
      'Delete Product',
      `Are you sure you want to delete "${productName}"? This action cannot be undone.`,
      () => {
        deleteProduct(productId).catch(err => {
          console.error("Failed to delete product:", err);
        });
      }
    );
  };

  if (isLoading && myProducts.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F1E8]">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A7C59] mx-auto mb-4"></div>
          <p className="text-[#6B7280]">Loading your products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F1E8]">
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-600">Error: {error}</p>
            <button
              onClick={() => fetchMyProducts()} 
              className="mt-4 px-4 py-2 bg-[#4A7C59] text-white rounded-lg hover:bg-[#3D6B4A] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-poppins font-bold text-[#1F2937] mb-2">
              My Products
            </h1>
            <p className="text-[#6B7280]">
              Manage your product catalog for group buys
            </p>
          </div>
          <Link href="/supplier/products/create">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#4A7C59] text-white rounded-lg hover:bg-[#3D6B4A] transition-colors font-medium">
              <PlusCircle className="h-4 w-4" />
              Add Product
            </button>
          </Link>
        </div>

        {/* Products List */}
        {myProducts.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 opacity-50">
              <Package className="w-full h-full text-[#4A7C59]" />
            </div>
            <h3 className="text-lg font-medium text-[#1F2937] mb-2">No Products Yet</h3>
            <p className="text-[#6B7280] mb-4">
              Create your first product to start offering group buys
            </p>
            <Link href="/supplier/products/create">
              <button className="px-6 py-3 bg-[#4A7C59] text-white rounded-lg hover:bg-[#3D6B4A] transition-colors font-medium">
                Add Your First Product
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ 
  product, 
  onDelete 
}: { 
  product: any; 
  onDelete: (id: string, name: string) => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="aspect-square w-full mb-4 bg-[#4A7C59]/10 rounded-lg overflow-hidden border-2 border-dashed border-[#4A7C59]/30">
        {product.image_url ? (
          <Image 
            src={product.image_url} 
            alt={product.name}
            width={200}
            height={200}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-[#4A7C59]/40" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <div>
          <h3 className="font-medium text-[#1F2937] line-clamp-2">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm text-[#6B7280] mt-1 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        {/* Keywords */}
        {product.search_keywords && (
          <div className="flex flex-wrap gap-1">
            {product.search_keywords.split(',').slice(0, 3).map((keyword: string, index: number) => (
              <span 
                key={index}
                className="text-xs bg-[#4A7C59]/10 text-[#4A7C59] px-2 py-1 rounded border border-[#4A7C59]/20"
              >
                {keyword.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
