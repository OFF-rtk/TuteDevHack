import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Session } from '@supabase/supabase-js';
import { 
  EnrichedGroupBuy, 
  EnrichedOrder, 
  User, 
  Product,
  SupplierAnalytics,
  CreateProductDto,
  CreateGroupBuyDto,
  PlaceOrderDto
} from '@/lib/types';
import apiClient from '@/lib/apiClient';
import { supabase } from '@/lib/supabaseClient';

// --- State Structure ---
interface AppState {
  // Session & User
  session: Session | null;
  currentUser: User | null; 
  
  // Data
  groupBuys: EnrichedGroupBuy[];
  myOrders: EnrichedOrder[];
  myProducts: Product[];
  myGroupBuys: EnrichedGroupBuy[];
  supplierAnalytics: SupplierAnalytics | null;

  // UI State
  isLoading: boolean;
  error: string | null;
  confirmModalState: { isOpen: boolean; title: string; message: string; onConfirm: () => void; };
  
  // --- ACTIONS ---
  // Auth
  setSession: (session: Session | null) => void;
  setCurrentUser: (user: User | null) => void;
  logout: () => Promise<void>;
  
  // UI Actions
  showConfirm: (title: string, message: string, onConfirm: () => void) => void;
  hideConfirm: () => void;

  // Vendor Actions
  fetchGroupBuys: () => Promise<void>;
  fetchMyOrders: () => Promise<void>;
  placeVoiceOrder: (command: string) => Promise<void>;
  placeClickOrder: (orderData: PlaceOrderDto) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;

  // Supplier Actions
  fetchMyProducts: () => Promise<void>;
  createProduct: (productData: CreateProductDto) => Promise<void>;
  updateProduct: (productId: string, productData: Partial<CreateProductDto>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  fetchMyGroupBuys: () => Promise<void>;
  createGroupBuy: (groupBuyData: CreateGroupBuyDto) => Promise<void>;
  updateGroupBuy: (groupBuyId: string, groupBuyData: Partial<CreateGroupBuyDto>) => Promise<void>;
  deleteGroupBuy: (groupBuyId: string) => Promise<void>;
  fetchSupplierAnalytics: () => Promise<void>;
}

// --- The Full-Featured Store ---
export const useAppStore = create<AppState>()(
  persist(
    (set, get): AppState => ({
      // --- Default State ---
      session: null,
      currentUser: null,
      groupBuys: [],
      myOrders: [],
      myProducts: [],
      myGroupBuys: [],
      supplierAnalytics: null,
      isLoading: false,
      error: null,
      confirmModalState: { isOpen: false, title: '', message: '', onConfirm: () => {} },

      // --- AUTH ACTIONS ---
      setSession: (session) => set({ session }),
      setCurrentUser: (user) => set({ currentUser: user }),
      logout: async () => {
        await supabase.auth.signOut();
        set({ 
          session: null, 
          currentUser: null, 
          groupBuys: [], 
          myOrders: [],
          myProducts: [],
          myGroupBuys: [],
          supplierAnalytics: null
        });
      },

      // --- UI ACTIONS ---
      showConfirm: (title, message, onConfirm) => set({
        confirmModalState: { isOpen: true, title, message, onConfirm: () => {
          get().hideConfirm();
          onConfirm();
        }}
      }),
      hideConfirm: () => set(state => ({ confirmModalState: { ...state.confirmModalState, isOpen: false } })),

      // --- VENDOR ACTIONS ---
      fetchGroupBuys: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.get('/group-buys');
          set({ groupBuys: response.data, isLoading: false });
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to fetch group buys.', isLoading: false });
        }
      },
      fetchMyOrders: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.get('/orders/view');
          set({ myOrders: response.data.orders, isLoading: false });
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to fetch your orders.', isLoading: false });
        }
      },
      placeVoiceOrder: async (command: string) => {
        set({ isLoading: true, error: null });
        try {
          await apiClient.post('/orders/voice', { command });
          await get().fetchMyOrders();
          await get().fetchGroupBuys();
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to place voice order.', isLoading: false });
          throw error;
        }
      },
      placeClickOrder: async (orderData: PlaceOrderDto) => {
        set({ isLoading: true, error: null });
        try {
          await apiClient.post('/orders/place', orderData);
          await get().fetchMyOrders();
          await get().fetchGroupBuys();
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to place order.', isLoading: false });
          throw error;
        }
      },
      cancelOrder: async (orderId: string) => {
        set({ isLoading: true, error: null });
        try {
          await apiClient.delete(`/orders/${orderId}`);
          await get().fetchMyOrders();
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to cancel order.', isLoading: false });
          throw error;
        }
      },

      // --- SUPPLIER ACTIONS ---
      fetchMyProducts: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.get('/products/supplier');
          set({ myProducts: response.data, isLoading: false });
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to fetch products.', isLoading: false });
        }
      },
      createProduct: async (productData: CreateProductDto) => {
        set({ isLoading: true, error: null });
        try {
          await apiClient.post('/products/create', productData);
          await get().fetchMyProducts();
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to create product.', isLoading: false });
          throw error;
        }
      },
      updateProduct: async (productId: string, productData: Partial<CreateProductDto>) => {
        set({ isLoading: true, error: null });
        try {
          await apiClient.patch(`/products/${productId}`, productData);
          await get().fetchMyProducts();
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to update product.', isLoading: false });
          throw error;
        }
      },
      deleteProduct: async (productId: string) => {
        set({ isLoading: true, error: null });
        try {
          await apiClient.delete(`/products/${productId}`);
          await get().fetchMyProducts();
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to delete product.', isLoading: false });
          throw error;
        }
      },
      fetchMyGroupBuys: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.get('/group-buys/mine');
          set({ myGroupBuys: response.data, isLoading: false });
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to fetch group buys.', isLoading: false });
        }
      },
      createGroupBuy: async (groupBuyData: CreateGroupBuyDto) => {
        set({ isLoading: true, error: null });
        try {
          await apiClient.post('/group-buys/create', groupBuyData);
          await get().fetchMyGroupBuys();
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to create group buy.', isLoading: false });
          throw error;
        }
      },
      updateGroupBuy: async (groupBuyId: string, groupBuyData: Partial<CreateGroupBuyDto>) => {
        set({ isLoading: true, error: null });
        try {
          await apiClient.patch(`/group-buys/${groupBuyId}`, groupBuyData);
          await get().fetchMyGroupBuys();
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to update group buy.', isLoading: false });
          throw error;
        }
      },
      deleteGroupBuy: async (groupBuyId: string) => {
        set({ isLoading: true, error: null });
        try {
          await apiClient.delete(`/group-buys/${groupBuyId}`);
          await get().fetchMyGroupBuys();
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to delete group buy.', isLoading: false });
          throw error;
        }
      },
      fetchSupplierAnalytics: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.get('/suppliers/dashboard/analytics');
          set({ supplierAnalytics: response.data, isLoading: false });
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to fetch analytics.', isLoading: false });
        }
      },
    }),
    {
      name: 'mandi-now-storage', 
      storage: createJSONStorage(() => localStorage), 
      partialize: (state) => ({ session: state.session, currentUser: state.currentUser }),
    }
  )
);