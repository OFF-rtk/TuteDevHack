// src/components/ui/QuantityModal.tsx
import React, { useState, useEffect } from 'react';
import { GroupBuy } from '../../types';
import Button from './Button';

interface QuantityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (quantity: number) => void;
    groupBuy: GroupBuy | null;
}

const QuantityModal: React.FC<QuantityModalProps> = ({ isOpen, onClose, onConfirm, groupBuy }) => {
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (isOpen) {
            setQuantity(1); // Reset quantity when modal opens
        }
    }, [isOpen]);

    if (!isOpen || !groupBuy) return null;

    const handleConfirm = () => {
        if (quantity > 0) {
            onConfirm(quantity);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl transform transition-all scale-100">
                <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Enter Quantity</h3>
                <p className="text-gray-600 mb-6">How much {groupBuy.product.name} would you like to order?</p>
                <div className="flex items-center justify-center space-x-4 mb-6">
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-24 text-center text-black px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                        min="1"
                    />
                    <span className="text-lg text-gray-700 font-medium">{groupBuy.product.unit}</span>
                </div>
                <div className="flex space-x-4">
                    <Button onClick={onClose} className="bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-300">Cancel</Button>
                    <Button onClick={handleConfirm}>Confirm Order</Button>
                </div>
            </div>
        </div>
    );
};

export default QuantityModal;