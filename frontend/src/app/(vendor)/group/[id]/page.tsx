'use client';
import React, { useState } from 'react';
import { useAppStore } from '@/stores/appStores';
import { cn, formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function GroupDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { groupBuys, placeClickOrder, isLoading } = useAppStore();
  const groupId = params.id as string;

  // Local state for the quantity input
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Find the specific group buy from the store's state
  const groupBuy = groupBuys.find(gb => gb.id === groupId);

  const handlePlaceOrder = async () => {
    if (!groupBuy || quantity <= 0) {
      setSubmitError('Invalid quantity.');
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await placeClickOrder({
        group_buy_id: groupBuy.id,
        quantity: quantity,
      });
      // On success, you can show a success message and redirect
      alert('Order placed successfully!');
      router.push('/my-orders');
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to place order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle loading state while data is being fetched by the layout
  if (isLoading && !groupBuy) {
    return <div className="p-8 text-center">Loading group buy details...</div>;
  }

  // Handle case where group buy is not found after loading
  if (!groupBuy) {
    return <div className="p-8 text-center">Group buy not found.</div>;
  }

  return (
    <div className="p-4 sm:p-6 pb-24 bg-gray-100">
      <Link href="/dashboard" className="text-orange-600 font-semibold mb-4 inline-flex items-center">
        &larr; Back to all groups
      </Link>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <img src={groupBuy.products?.image_url} alt={groupBuy.products?.name} className="w-full h-48 object-cover" />
        <div className="p-5">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">{groupBuy.products?.name}</h2>
            <span className={cn('text-sm font-bold px-3 py-1.5 rounded-full', groupBuy.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800')}>{groupBuy.status}</span>
          </div>
          <p className="text-gray-600 mt-2">{groupBuy.products?.description}</p>
          
          <div className="mt-6 border-t border-gray-200 pt-4 space-y-3">
            {/* THE FIX: Use optional chaining to safely access the supplier's name */}
            <div className="flex justify-between"><span className="text-gray-500">Supplier:</span> <span className="font-semibold text-gray-800">{groupBuy.profiles?.full_name || 'Unknown Supplier'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Price per kg:</span> <span className="font-semibold text-green-600 text-lg">₹{groupBuy.price_per_unit}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Group Target:</span> <span className="font-semibold text-gray-800">{groupBuy.target_quantity} kg</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Ends On:</span> <span className="font-semibold text-gray-800">{formatDate(groupBuy.end_date)}</span></div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-gray-600 font-semibold">Group Progress</h4>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${(groupBuy.current_quantity / groupBuy.target_quantity) * 100}%` }}></div>
            </div>
            <p className="text-right text-sm text-gray-500 mt-1">{groupBuy.current_quantity} / {groupBuy.target_quantity} kg filled</p>
          </div>

          {/* Order Placement Section */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800">Join this Group Buy</h3>
            <div className="flex items-end gap-4 mt-4">
                <Input
                    id="quantity"
                    label="Quantity (kg)"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min="1"
                    className="w-32"
                />
                <Button onClick={handlePlaceOrder} disabled={isSubmitting || groupBuy.status !== 'ACTIVE'}>
                    {isSubmitting ? 'Placing Order...' : 'Place Order'}
                </Button>
            </div>
            {submitError && <p className="text-red-500 text-sm mt-2">{submitError}</p>}
             {groupBuy.status !== 'ACTIVE' && <p className="text-yellow-600 text-sm mt-2">This group buy is no longer active.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};