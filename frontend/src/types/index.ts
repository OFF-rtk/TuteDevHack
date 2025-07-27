// src/types/index.ts

export type Role = 'VENDOR' | 'SUPPLIER';

export interface Product {
    id: string;
    name: string;
    description: string;
    image_url: string;
    search_keywords: string;
    supplier_id: string;
    created_at: string;
}

export interface EnrichedGroupBuy {
    id: string;
    supplier_id: string;
    product_id: string;
    target_quantity: number;
    current_quantity: number;
    price_per_unit: number;
    status: 'ACTIVE' | 'INACTIVE';
    end_date: string;
    area_name: string;
    created_at: string;
    
    // Enriched relations from your database
    product?: Product;
    profiles?: {
        full_name: string;
        area_name: string;
        role: Role;
    };
}

export interface EnrichedOrder {
    id: string;
    group_buy_id: string;
    vendor_id: string;
    quantity: number;
    status: 'PLACED' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED';
    created_at: string;
    
    // Enriched relations
    group_buy?: EnrichedGroupBuy;
}

export interface User {
    id: string;
    full_name?: string;
    email: string;
    role: Role;
    area_name: string;  // Changed from area_locality
    created_at: string;
}

// DTOs for API calls
export interface CreateProductDto {
    name: string;
    description: string;
    image_url: string;
    search_keywords: string;
}

export interface CreateGroupBuyDto {
    product_id: string;
    target_quantity: number;
    price_per_unit: number;
    end_date: string;
}

export interface PlaceOrderDto {
    group_buy_id: string;
    quantity: number;
}

export interface SupplierAnalytics {
    total_products: number;
    active_group_buys: number;
    total_orders: number;
    total_revenue: number;
}
