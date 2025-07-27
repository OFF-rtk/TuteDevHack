// --- src/lib/types.ts ---
// Centralized TypeScript type definitions for the application.

export type Role = 'VENDOR' | 'SUPPLIER';

export interface Product {
    id: string;
    supplier_id: string;
    name: string;
    description?: string;
    image_url?: string;
    search_keywords?: string;
    created_at: string;
    updated_at?: string;
}

export interface GroupBuy {
    id: string;
    supplier_id: string;
    product_id: string;
    title?: string;
    target_quantity: number;
    current_quantity: number;
    price_per_unit: number;
    status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    end_date: string;
    area_name: string;
    created_at: string;
}

// Enriched GroupBuy (as returned by your endpoints with nested data)
export interface EnrichedGroupBuy extends GroupBuy {
    products: Product;
    profiles: {
        id: string;
        full_name: string;
    };
}

export interface Order {
    id: string;
    quantity: number;
    status: 'PLACED' | 'PENDING' | 'DELIVERED' | 'CANCELLED';
    created_at: string;
    group_buy_id: string;
    vendor_id?: string; // if you track which vendor placed the order
}

// Enriched Order (as returned by getOrdersByVendor endpoint)
export interface EnrichedOrder extends Order {
    group_buys: {
        id: string;
        status: string;
        product_id: string;
    };
    products: {
        id: string;
        created_at: string;
        name: string;
        description: string;
        image_url: string;
        search_keywords: string;
    };
}

export interface User {
    id: string;
    full_name?: string;
    email?: string;
    role: Role;
    area_name?: string; // matches your backend field name
    created_at?: string;
    updated_at?: string;
}

// Supplier Analytics Response
export interface SupplierAnalytics {
    total_group_buys: number;
    total_ordered_quantity: number;
    recent_group_buys: Array<{
        id: string;
        title?: string;
        price_per_unit: number;
        target_quantity: number;
        current_quantity: number;
        end_date: string;
        area_name: string;
        status: string;
        ordered_quantity: number;
    }>;
}

// API Response Types
export interface OrdersResponse {
    orders: EnrichedOrder[];
}

export interface ProductsResponse extends Array<Product> {}

export interface GroupBuysResponse extends Array<EnrichedGroupBuy> {}

// DTOs for API requests
export interface CreateProductDto {
    name: string;
    description?: string;
    image_url?: string;
    search_keywords?: string;
}

export interface CreateGroupBuyDto {
    product_id: string;
    title?: string;
    end_date: string;
    target_quantity?: number;
    area_name: string;
    price_per_unit: number;
}

export interface PlaceOrderDto {
    group_buy_id: string;
    quantity: number;
}

// Utility type for API responses
export type ApiResponse<T> = {
    data: T;
    error?: string;
    message?: string;
};
