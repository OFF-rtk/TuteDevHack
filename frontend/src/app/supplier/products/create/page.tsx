'use client';
import React, { useState } from 'react';
import { useAppStore } from '@/stores/appStores';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CreateProductDto } from '@/lib/types';

export default function CreateProductPage() {
  const { createProduct, isLoading } = useAppStore();
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<CreateProductDto>({
    name: '',
    description: '',
    image_url: '',
    search_keywords: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name) {
      setError('Product name is required.');
      return;
    }

    try {
      await createProduct(formData);
      alert('Success! Your new product has been created.');
      router.push('/supplier/products'); // Redirect to the products list page
    } catch (err: any) {
      // THE FIX: This will now display any error from the backend
      setError(err.message || 'Failed to create product. Please try again.');
    }
  };

  return (
    <div className="p-4 sm:p-6 pb-24 bg-gray-50">
      <Link href="/supplier/products" className="text-orange-600 font-semibold mb-6 flex items-center">&larr; Back to Products</Link>
      <h2 className="text-2xl font-bold text-gray-800 mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>Add a New Product</h2>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg space-y-6 max-w-2xl mx-auto">
        <Input 
          id="name" 
          label="Product Name" 
          type="text" 
          required 
          placeholder="e.g., Premium Onions"
          value={formData.name}
          onChange={handleInputChange}
        />
        <Input 
          id="description" 
          label="Description (Optional)" 
          type="text" 
          placeholder="e.g., Top grade white onions, handpicked quality"
          value={formData.description}
          onChange={handleInputChange}
        />
        <Input 
          id="image_url" 
          label="Image URL (Optional)" 
          type="url" 
          placeholder="https://example.com/image.jpg"
          value={formData.image_url}
          onChange={handleInputChange}
        />
        <Input 
          id="search_keywords" 
          label="Search Keywords (Optional)" 
          type="text" 
          placeholder="e.g., onions, safed, pyaz, premium"
          value={formData.search_keywords}
          onChange={handleInputChange}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" variant="primary" isLoading={isLoading}>
          Create Product
        </Button>
      </form>
    </div>
  );
}
