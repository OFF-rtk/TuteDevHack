'use client';
import React, { useEffect } from 'react';
import { useAppStore } from '@/stores/appStores';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button'; // Using your custom button
import { PlusCircle, Trash2, Edit } from 'lucide-react';

export default function MyProductsPage() {
  const { 
    myProducts, 
    isLoading, 
    error, 
    fetchMyProducts,
    deleteProduct,
    showConfirm 
  } = useAppStore();

  useEffect(() => {
    fetchMyProducts();
  }, [fetchMyProducts]);

  const handleDelete = (productId: string, productName: string) => {
    showConfirm(
      'Delete Product',
      `Are you sure you want to delete "${productName}"? This action cannot be undone.`,
      () => {
        deleteProduct(productId).catch(err => {
          console.error("Failed to delete product from component", err);
        });
      }
    );
  };

  if (isLoading && myProducts.length === 0) {
    return <div className="text-center p-10">Loading your products...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Manage Your Products</h1>
        <Link 
          href="/supplier/products/create" 
          className="w-auto px-4 py-2 text-sm font-semibold shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-md focus:outline-none focus:ring-4 rounded-lg flex items-center justify-center bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-300"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Product
        </Link>
      </div>
      
      {myProducts.length === 0 && !isLoading ? (
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold">No Products Found</h3>
          <p className="text-gray-500 mt-2">You haven't added any products yet. Click "Add New Product" to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md">
          <div className="divide-y divide-gray-200">
            {myProducts.map(product => (
              <div key={product.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Image 
                    src={product.image_url || '/images/placeholder.png'} 
                    alt={product.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500 truncate max-w-xs">{product.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* CORRECTED: Using custom classes for a disabled-like style */}
                  <Button 
                    className="bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-300 text-xs py-2 px-3 h-auto w-auto" 
                    disabled
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  {/* CORRECTED: Using the 'danger' variant and custom classes for size */}
                  <Button 
                    variant="danger" 
                    className="text-xs py-2 px-3 h-auto w-auto"
                    onClick={() => handleDelete(product.id, product.name)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}