'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/stores/appStores';
import { cn, formatCurrency, calculateProgress } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input} from '@/components/ui/Input';
import type { EnrichedGroupBuy } from '@/lib/types';

// Time remaining utility function
const getTimeRemaining = (endDate: string) => {
  const total = Date.parse(endDate) - Date.now();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  
  return { total, days, hours, minutes, seconds };
};

export default function GroupDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { groupBuys, placeClickOrder, isLoading, openAlertModal } = useAppStore();
  const groupId = params.id as string;

  // Local state
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0, total: 0
  });

  // Find the specific group buy (typed as EnrichedGroupBuy)
  const groupBuy: EnrichedGroupBuy | undefined = groupBuys.find(gb => gb.id === groupId);

  // Update countdown timer
  useEffect(() => {
    if (!groupBuy) return;

    const updateTimer = () => {
      const remaining = getTimeRemaining(groupBuy.end_date);
      setTimeRemaining(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [groupBuy]);

  const handlePlaceOrder = async () => {
    if (!groupBuy || quantity <= 0) {
      setSubmitError('Invalid quantity.');
      return;
    }

    const maxQuantity = groupBuy.target_quantity - groupBuy.current_quantity;
    if (quantity > maxQuantity) {
      setSubmitError(`Maximum available quantity is ${maxQuantity} units`);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await placeClickOrder({
        group_buy_id: groupBuy.id,
        quantity: quantity,
      });

      openAlertModal(
        'Order Placed Successfully!',
        `Your order for ${quantity} units of ${groupBuy.products.name} has been placed successfully.`
      );
      
      router.push('/my-orders');
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to place order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading && !groupBuy) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading group buy details...</p>
      </div>
    );
  }

  // Not found state
  if (!groupBuy) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Group Buy Not Found</h2>
        <p className="text-gray-600 mb-4">The group buy you're looking for doesn't exist.</p>
        <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  const progress = calculateProgress(groupBuy.current_quantity, groupBuy.target_quantity);
  const isExpired = timeRemaining.total <= 0;
  const maxQuantity = groupBuy.target_quantity - groupBuy.current_quantity;

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-[#FF6B35] hover:text-[#E55A2B] transition-colors"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </button>

      {/* Main Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Product Image */}
        <div className="aspect-video w-full bg-gray-100">
          <img
            src={groupBuy.products.image_url || "/placeholder.svg"}
            alt={groupBuy.products.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-poppins font-bold text-[#1F2937] mb-2">
                {groupBuy.title || groupBuy.products.name}
              </h1>
            </div>
            <span className={cn(
              'text-sm font-bold px-3 py-1.5 rounded-full',
              groupBuy.status === 'ACTIVE' 
                ? 'bg-green-100 text-green-800' 
                : groupBuy.status === 'COMPLETED'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            )}>
              {groupBuy.status}
            </span>
          </div>

          {/* Product Description */}
          {groupBuy.products.description && (
            <p className="text-gray-600">{groupBuy.products.description}</p>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Price per unit</p>
              <p className="text-xl font-semibold text-green-600">
                {formatCurrency(groupBuy.price_per_unit)}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Area</p>
              <p className="text-xl font-semibold text-[#1F2937]">
                {groupBuy.area_name}
              </p>
            </div>
          </div>

          {/* Progress Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">
                {groupBuy.current_quantity}/{groupBuy.target_quantity} units
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-[#FF6B35] h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              {progress.toFixed(1)}% complete • {maxQuantity} units remaining
            </p>
          </div>

          {/* Countdown Timer */}
          {!isExpired && groupBuy.status === 'ACTIVE' ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800 mb-2">Time Remaining</p>
              <div className="flex gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-yellow-900">{timeRemaining.days}</p>
                  <p className="text-xs text-yellow-700">Days</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-900">{timeRemaining.hours}</p>
                  <p className="text-xs text-yellow-700">Hours</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-900">{timeRemaining.minutes}</p>
                  <p className="text-xs text-yellow-700">Minutes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-900">{timeRemaining.seconds}</p>
                  <p className="text-xs text-yellow-700">Seconds</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">
                {groupBuy.status === 'COMPLETED' ? 'This group buy has been completed' :
                 groupBuy.status === 'CANCELLED' ? 'This group buy has been cancelled' :
                 'This group buy has expired'}
              </p>
            </div>
          )}

          {/* Order Placement Section */}
          <div className="border-t pt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Place Your Order</h3>
            
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <Input
                  id="quantity"
                  label="Quantity (units)"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min="1"
                  max={maxQuantity}
                  disabled={isExpired || groupBuy.status !== 'ACTIVE'}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Total: {formatCurrency(quantity * groupBuy.price_per_unit)}
                </p>
              </div>
              
              <Button
                onClick={handlePlaceOrder}
                disabled={isSubmitting || isExpired || groupBuy.status !== 'ACTIVE' || maxQuantity <= 0}
                className="px-8"
              >
                {isSubmitting ? 'Placing Order...' : 
                 groupBuy.status !== 'ACTIVE' ? groupBuy.status :
                 isExpired ? 'Expired' :
                 progress >= 100 ? 'Target Reached' :
                 maxQuantity <= 0 ? 'Sold Out' :
                 'Place Order'}
              </Button>
            </div>

            {/* Error Message */}
            {submitError && (
              <p className="text-red-500 text-sm">{submitError}</p>
            )}

            {/* Status Messages */}
            {groupBuy.status !== 'ACTIVE' && (
              <p className="text-yellow-600 text-sm">
                This group buy is {groupBuy.status.toLowerCase()}.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
