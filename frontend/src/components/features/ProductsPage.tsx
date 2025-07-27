// src/components/features/ProductsPage.tsx
import React, { useState } from 'react';
import { GroupBuy } from '../../types';
import Button from '../ui/Button';

interface ProductsPageProps {
    groupBuys: GroupBuy[];
    navigate: (page: string, state?: any) => void;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ groupBuys, navigate }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredGroupBuys = groupBuys.filter(gb => 
        gb.product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 sm:p-6 pb-24 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-800 mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>Products</h2>
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                {filteredGroupBuys.map(item => (
                    <div key={item.id} className="bg-white rounded-xl shadow-md transition-shadow hover:shadow-lg animate-fade-in">
                        <img src={item.product.image_url} alt={item.product.name} className="w-full h-24 object-cover rounded-t-lg" />
                        <div className="p-3">
                            <h3 className="font-semibold text-gray-900 truncate">{item.product.name}</h3>
                            <p className="text-sm text-green-600 font-bold">₹{item.price_per_unit}/{item.product.unit}</p>
                            <Button onClick={() => navigate('group-details', { groupId: item.id })} className="mt-3 text-sm py-2 h-auto">View Group Buy</Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductsPage;