// src/components/ui/AlertModal.tsx
import React from 'react';
import Button from './Button';

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    type?: 'success' | 'error' | 'info';
}

const AlertModal: React.FC<AlertModalProps> = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    type = 'info' 
}) => {
    if (!isOpen) return null;

    const getIconAndColors = () => {
        switch (type) {
            case 'success':
                return {
                    icon: (
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                    ),
                    titleColor: 'text-green-800',
                    messageColor: 'text-green-600'
                };
            case 'error':
                return {
                    icon: (
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </div>
                    ),
                    titleColor: 'text-red-800',
                    messageColor: 'text-red-600'
                };
            default:
                return {
                    icon: null,
                    titleColor: 'text-gray-900',
                    messageColor: 'text-gray-600'
                };
        }
    };

    const { icon, titleColor, messageColor } = getIconAndColors();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl transform transition-all scale-100">
                {icon}
                <h3 className={`text-xl font-bold mb-4 ${titleColor}`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {title}
                </h3>
                <div className={`mb-6 ${messageColor}`}>
                    {children}
                </div>
                <Button onClick={onClose} variant={type === 'error' ? 'secondary' : 'primary'}>
                    OK
                </Button>
            </div>
        </div>
    );
};

export default AlertModal;
