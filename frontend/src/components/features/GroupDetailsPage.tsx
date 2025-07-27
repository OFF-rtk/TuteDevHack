// src/components/features/GroupDetailsPage.tsx
import React from 'react';
import { GroupBuy } from '../../types';
import { cn, formatDate } from '../../lib/utils';
import Button from '../ui/Button';

interface GroupDetailsPageProps {
    groupBuy: GroupBuy;
    supplierName: string;
    navigate: (page: string) => void;
    onPlaceOrderClick: (groupBuy: GroupBuy) => void;
}

const GroupDetailsPage: React.FC<GroupDetailsPageProps> = ({ groupBuy, supplierName, navigate, onPlaceOrderClick }) => {
    return (
        <div className="p-4 sm:p-6 pb-24 bg-gray-100">
            <button onClick={() => navigate('dashboard')} className="text-orange-600 font-semibold mb-4 flex items-center">&larr; Back to all groups</button>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img src={groupBuy.product.image_url} alt={groupBuy.product.name} className="w-full h-48 object-cover" />
                <div className="p-5">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900">{groupBuy.product.name}</h2>
                        <span className={cn('text-sm font-bold px-3 py-1.5 rounded-full', groupBuy.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800')}>{groupBuy.status}</span>
                    </div>
                    <p className="text-gray-600 mt-2">{groupBuy.product.description}</p>
                    
                    <div className="mt-6 border-t border-gray-200 pt-4 space-y-3">
                        <div className="flex justify-between"><span className="text-gray-500">Supplier:</span> <span className="font-semibold text-gray-800">{supplierName}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Price per {groupBuy.product.unit}:</span> <span className="font-semibold text-green-600 text-lg">₹{groupBuy.price_per_unit}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Group Target:</span> <span className="font-semibold text-gray-800">{groupBuy.target_quantity} {groupBuy.product.unit}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Ends On:</span> <span className="font-semibold text-gray-800">{formatDate(groupBuy.end_date)}</span></div>
                    </div>
                    
                    <div className="mt-6">
                        <h4 className="text-gray-600 font-semibold">Group Progress ({groupBuy.participants} participants)</h4>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                            <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${(groupBuy.current_quantity / groupBuy.target_quantity) * 100}%` }}></div>
                        </div>
                        <p className="text-right text-sm text-gray-500 mt-1">{groupBuy.current_quantity} / {groupBuy.target_quantity} {groupBuy.product.unit} filled</p>
                    </div>

                    <Button onClick={() => onPlaceOrderClick(groupBuy)} className="mt-8">Place Order</Button>
                </div>
            </div>
        </div>
    );
};

export default GroupDetailsPage;