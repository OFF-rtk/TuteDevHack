'use client';
import React, { useState } from 'react';
import { useAppStore } from '@/stores/appStores';
import  Button  from '@/components/ui/Button';
import  Input  from '@/components/ui/Input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateGroupBuyPage() {
    const { showAlert } = useAppStore();
    const router = useRouter();
    const [selectedProductId, setSelectedProductId] = useState('');

    // Dummy product list for the select dropdown
    const products = [
      { id: '9ae3f86a-9b92-45e5-85e6-c4801f5b3eed', name: 'Onions' },
      { id: '1b2c3d4e-5f67-89ab-cdef-0123456789ab', name: 'Tomatoes' }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would send this data to your backend API
        showAlert('Success!', 'Your new group buy has been created.', () => {
            router.push('/supplier/dashboard');
        });
    };

    return (
        <div className="p-4 sm:p-6 pb-24 bg-gray-50">
            <Link href="/supplier/dashboard" className="text-green-600 font-semibold mb-6 flex items-center">&larr; Back to Dashboard</Link>
            <h2 className="text-2xl font-bold text-gray-800 mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>Create a New Group Buy</h2>
            
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg space-y-6">
                <div>
                    <label htmlFor="product_id" className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                    <select 
                        id="product_id" 
                        required
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                        className="mt-1 block w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-base text-black"
                    >
                        <option value="">-- Select a product --</option>
                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
<div className='focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'>
                <Input id="title"  className='focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent' label="Group Buy Title (Optional)" type="text" placeholder="e.g., Bulk Onions for August" /></div>
                <Input id="end_date" label="End Date" type="datetime-local" required />
                <Input id="target_quantity" label="Target Quantity (Optional)" type="number" placeholder="100" />
                <Input id="area_name" label="Delivery Area" type="text" required placeholder="e.g., Nashik region" />
                <Input id="price_per_unit" label="Price Per Unit (₹)" type="number" step="0.01" required placeholder="40.5" />

                <Button type="submit" variant="secondary">Create Group Buy</Button>
            </form>
        </div>
    );
}
