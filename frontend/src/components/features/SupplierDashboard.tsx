// src/components/features/SupplierDashboard.tsx
import React from 'react';
import { GroupBuy, User } from '../../types';
import Button from '../ui/Button';

const SupplierDashboard: React.FC<{ groupBuys: GroupBuy[], user: User }> = ({ groupBuys, user }) => {
    const createdGroups = groupBuys.filter(g => g.supplier_id === 'sup_prabhu'); // Mocking for demo
    
    return (
        <div className="p-4 sm:p-6 pb-24 bg-gray-100">
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl shadow">
                    <h3 className="text-gray-500 text-sm font-medium">Total Groups</h3>
                    <p className="text-2xl font-bold text-gray-900">{createdGroups.length}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow">
                    <h3 className="text-gray-500 text-sm font-medium">Total Participants</h3>
                    <p className="text-2xl font-bold text-gray-900">{createdGroups.reduce((acc, g) => acc + g.participants, 0)}</p>
                </div>
            </div>
            
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Your Created Groups</h2>
                <Button variant="secondary" className="w-auto px-4 py-2 text-sm">Create Group</Button>
            </div>

            <div className="space-y-4">
                {createdGroups.map(item => (
                       <div key={item.id} className="bg-white rounded-xl p-4 shadow-md">
                           <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                           <p className="text-sm text-gray-500">{item.participants} participants have joined.</p>
                           <p className="text-sm text-gray-500">{item.current_quantity} / {item.target_quantity} {item.product.unit} filled.</p>
                       </div>
                ))}
            </div>
        </div>
    );
};

export default SupplierDashboard;