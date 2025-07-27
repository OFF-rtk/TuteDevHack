// --- src/lib/types.ts ---
// Centralized TypeScript type definitions for the application.

export type Role = 'VENDOR' | 'SUPPLIER';

export interface Product {
    name: string;
    description: string;
    image_url: string;
    unit: string;
    search_keywords: string[];
}

export interface GroupBuy {
    id: string;
    supplier_id: string;
    product: Product;
    target_quantity: number;
    current_quantity: number;
    price_per_unit: number;
    status: 'ACTIVE' | 'INACTIVE';
    end_date: string;
    participants: number;
}

export interface MyOrder {
    id: string;
    group_buy_id: string;
    product_name: string;
    quantity: number;
    unit: string;
    status: 'PENDING' | 'PAID' | 'DELIVERED';
    delivery_details: string | null;
    createdAt: string; // ISO string for the order creation time
}

export interface User {
    id: string;
    full_name?: string;
    email: string;
    role: Role;
    area_locality: string;
}

export interface AppData {
    group_buys: GroupBuy[];
    my_orders: MyOrder[];
    users: Record<string, User>; // Using a record for easier user lookup
    suppliers: Record<string, { name: string }>;
}
