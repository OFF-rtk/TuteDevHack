'use client';
import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/stores/appStores';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CreateGroupBuyDto } from '@/lib/types';

export default function CreateGroupBuyPage() {
  const { 
    myProducts, 
    fetchMyProducts, 
    createGroupBuy, 
    isLoading 
  } = useAppStore();
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<Partial<CreateGroupBuyDto>>({
    product_id: '',
    area_name: '',
    price_per_unit: 0,
    target_quantity: 100,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch the supplier's products when the component mounts
  useEffect(() => {
    fetchMyProducts();
  }, [fetchMyProducts]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === 'price_per_unit' || id === 'target_quantity' ? Number(value) : value,
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
      alert('Success! Your new group buy has been created.');
      router.push('/supplier/dashboard'); // Redirect after success
    } catch (err: any) {
      setError(err.message || 'Failed to create group buy.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 pb-24 bg-gray-50">
      <Link href="/supplier/dashboard" className="text-orange-600 font-semibold mb-6 flex items-center">&larr; Back to Dashboard</Link>
      <h2 className="text-2xl font-bold text-gray-800 mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>Create a New Group Buy</h2>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg space-y-6 max-w-2xl mx-auto">
        <div>
          <label htmlFor="product_id" className="block text-sm font-medium text-gray-700 mb-1">Product</label>
          {isLoading && myProducts.length === 0 ? <p>Loading your products...</p> : (
            <select 
              id="product_id" 
              required
              value={formData.product_id}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base text-black"
            >
              <option value="">-- Select a product --</option>
              {myProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          )}
        </div>

        <Input id="end_date" label="End Date" type="datetime-local" required onChange={handleInputChange} />
        <Input id="target_quantity" label="Target Quantity (kg)" type="number" placeholder="100" value={formData.target_quantity} onChange={handleInputChange} />
        <Input id="area_name" label="Delivery Area" type="text" required placeholder="e.g., Mhow Gaon" value={formData.area_name} onChange={handleInputChange} />
        <Input id="price_per_unit" label="Price Per Unit (₹ per kg)" type="number" step="0.01" required placeholder="40.5" value={formData.price_per_unit} onChange={handleInputChange} />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Group Buy'}
        </Button>
      </form>
    </div>
  );
}
