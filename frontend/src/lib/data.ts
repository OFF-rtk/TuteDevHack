import { AppData } from './types';

// --- src/lib/data.ts ---
// Initial dummy data for the application.
export const initialDummyData: AppData = {
    group_buys: [
        { id: "gb_001", supplier_id: "sup_prabhu", product: { name: "Onions", description: "Fresh Nashik Onions, sourced directly from farms.", image_url: "https://i.imgur.com/LdCne9W.jpeg", unit: "kg", search_keywords: ["onion", "pyaz", "kanda"] }, target_quantity: 100, current_quantity: 65, price_per_unit: 22, end_date: "2025-07-28T22:00:00Z", status: 'ACTIVE', participants: 12 },
        { id: "gb_002", supplier_id: "sup_prabhu", product: { name: "Potatoes", description: "A-grade potatoes, perfect for chips and curries.", image_url: "https://i.imgur.com/3p32p6p.jpeg", unit: "kg", search_keywords: ["potato", "aloo", "batata"] }, target_quantity: 150, current_quantity: 110, price_per_unit: 18, end_date: "2025-07-29T23:00:00Z", status: 'ACTIVE', participants: 18 },
        { id: "gb_003", supplier_id: "sup_sharma", product: { name: "Fortune Cooking Oil", description: "5-litre can of refined soybean cooking oil.", image_url: "https://i.imgur.com/K3v0A3y.jpeg", unit: "5L can", search_keywords: ["oil", "tel", "fortune", "cooking oil"] }, target_quantity: 50, current_quantity: 15, price_per_unit: 750, end_date: "2025-07-27T10:00:00Z", status: 'INACTIVE', participants: 4 }
    ],
    my_orders: [
        { id: "order_xyz", group_buy_id: "gb_001", product_name: "Onions", quantity: 5, unit: "kg", status: "PENDING", delivery_details: null, createdAt: new Date().toISOString() },
    ],
    users: {
        "vendor_user_1": { id: "vendor_user_1", email: "vendor@test.com", full_name: "Raju's Chaat", role: 'VENDOR', area_locality: "Mhow Gaon" },
        "supplier_user_1": { id: "supplier_user_1", email: "supplier@test.com", full_name: "Prabhu Kirana", role: 'SUPPLIER', area_locality: "Indore" }
    },
    suppliers: {
        "sup_prabhu": { name: "Prabhu Kirana Store" },
        "sup_sharma": { name: "Sharma Oils & Grains" }
    }
};
