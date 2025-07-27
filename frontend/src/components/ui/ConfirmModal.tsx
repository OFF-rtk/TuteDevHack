// src/components/ui/ConfirmModal.tsx
import React from 'react';
import Button from './Button';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    children: React.ReactNode;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl transform transition-all scale-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>{title}</h3>
                <div className="text-gray-600 mb-6">{children}</div>
                <div className="flex space-x-4">
                    <Button onClick={onClose} className="bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-300">No, Keep It</Button>
                    <Button onClick={onConfirm} variant="danger">Yes, Cancel</Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;