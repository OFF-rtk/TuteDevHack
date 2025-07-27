// src/components/ui/Input.tsx
import { cn } from '@/lib/utils';
import React from 'react'
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, id, ...props }, ref) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            id={id}
            ref={ref}
            className="mt-1 block w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base text-black"
            {...props}
        />
    </div>
));

export default Input;