'use client';
import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/stores/appStores';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { MyOrder } from '@/lib/types';

const OrderCard: React.FC<{ order: MyOrder, onCancelOrder: (orderId: string) => void }> = ({ order, onCancelOrder }) => {
    const [timeLeft, setTimeLeft] = useState("");
    const [canCancel, setCanCancel] = useState(false);

    useEffect(() => {
        if (order.status !== 'PENDING') return;

        const CANCELLATION_WINDOW = 30 * 60 * 1000; // 30 minutes in milliseconds

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const createdAt = new Date(order.createdAt).getTime();
            const timePassed = now - createdAt;
            const remainingTime = CANCELLATION_WINDOW - timePassed;

            if (remainingTime > 0) {
                const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
                setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
                setCanCancel(true);
            } else {
                setTimeLeft("00:00");
                setCanCancel(false);
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [order]);

    const statusClasses: Record<MyOrder['status'], string> = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        PAID: 'bg-green-100 text-green-800',
        DELIVERED: 'bg-blue-100 text-blue-800'
    };

    return (
        <div className="bg-white rounded-xl p-4 shadow-md animate-fade-in">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-semibold text-gray-900">{order.product_name}</h3>
                    <p className="text-sm text-gray-500">{order.quantity} {order.unit}</p>
                </div>
                <span className={cn('text-xs font-bold px-2.5 py-1 rounded-full', statusClasses[order.status])}>
                    {order.status}
                </span>
            </div>
            {order.status === 'PENDING' && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    {canCancel ? (
                        <>
                            <p className="text-sm text-center text-gray-600 mb-2">
                                Time left to cancel: <span className="font-bold text-red-600">{timeLeft}</span>
                            </p>
                            <Button onClick={() => onCancelOrder(order.id)} variant="danger" className="py-2 text-sm h-auto">
                                Cancel Order
                            </Button>
                        </>
                    ) : (
                        <p className="text-sm text-center text-gray-500">Cancellation window has closed.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default function MyOrdersPage() {
    const { data, cancelOrder } = useAppStore();

    return (
        <div className="p-4 sm:p-6 pb-24 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-800 mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>My Orders</h2>
            {data.my_orders.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-gray-500">You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {data.my_orders.map(order => (
                        <OrderCard key={order.id} order={order} onCancelOrder={cancelOrder} />
                    ))}
                </div>
            )}
        </div>
    );
};
