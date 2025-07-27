'use client';
import { create } from 'zustand';
import { AppData, User, GroupBuy, MyOrder } from '@/lib/types';
import { initialDummyData } from '@/lib/data';

interface AppState {
    currentUser: User | null;
    currentPage: string;
    pageState: any;
    data: AppData;
    modalState: { isOpen: boolean; title: string; message: string; onOk: () => void; };
    confirmModalState: { isOpen: boolean; title: string; message: string; onConfirm: () => void; };
    quantityModalState: { isOpen: boolean; groupBuy: GroupBuy | null; };
    
    setCurrentUser: (user: User | null) => void;
    setCurrentPage: (page: string, state?: any) => void;
    
    showAlert: (title: string, message: string, onOk?: () => void) => void;
    hideAlert: () => void;

    showConfirm: (title: string, message: string, onConfirm: () => void) => void;
    hideConfirm: () => void;

    showQuantityModal: (groupBuy: GroupBuy) => void;
    hideQuantityModal: () => void;

    addOrder: (groupBuy: GroupBuy, quantity: number) => void;
    cancelOrder: (orderId: string) => void;
    logout: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
    currentUser: null,
    currentPage: 'auth',
    pageState: null,
    data: initialDummyData,
    modalState: { isOpen: false, title: '', message: '', onOk: () => {} },
    confirmModalState: { isOpen: false, title: '', message: '', onConfirm: () => {} },
    quantityModalState: { isOpen: false, groupBuy: null },

    setCurrentUser: (user) => set({ currentUser: user }),
    setCurrentPage: (page, state = null) => set({ currentPage: page, pageState: state }),

    showAlert: (title, message, onOk) => {
        set({
            modalState: {
                isOpen: true,
                title,
                message,
                onOk: () => {
                    get().hideAlert();
                    if (onOk) onOk();
                }
            }
        });
    },
    hideAlert: () => set(state => ({ modalState: { ...state.modalState, isOpen: false } })),

    showConfirm: (title, message, onConfirm) => {
        set({
            confirmModalState: {
                isOpen: true,
                title,
                message,
                onConfirm: () => {
                    get().hideConfirm();
                    onConfirm();
                }
            }
        });
    },
    hideConfirm: () => set(state => ({ confirmModalState: { ...state.confirmModalState, isOpen: false } })),

    showQuantityModal: (groupBuy) => set({ quantityModalState: { isOpen: true, groupBuy } }),
    hideQuantityModal: () => set({ quantityModalState: { isOpen: false, groupBuy: null } }),

    addOrder: (groupBuy, quantity) => {
        const newOrder: MyOrder = {
            id: `order_${new Date().getTime()}`,
            group_buy_id: groupBuy.id,
            product_name: groupBuy.product.name,
            quantity: quantity,
            unit: groupBuy.product.unit,
            status: 'PENDING',
            delivery_details: 'Awaiting group buy completion',
            createdAt: new Date().toISOString()
        };

        set(state => ({
            data: {
                ...state.data,
                my_orders: [newOrder, ...state.data.my_orders],
                group_buys: state.data.group_buys.map(gb => 
                    gb.id === groupBuy.id 
                    ? { ...gb, current_quantity: gb.current_quantity + quantity, participants: gb.participants + 1 } 
                    : gb
                )
            }
        }));
        
        get().hideQuantityModal();
        get().showAlert(
            'Order Placed!',
            `Your order for ${quantity} ${groupBuy.product.unit} of ${groupBuy.product.name} has been submitted. You have 30 minutes to cancel.`,
            () => get().setCurrentPage('my-orders')
        );
    },

    cancelOrder: (orderId) => {
        const orderToCancel = get().data.my_orders.find(o => o.id === orderId);
        if (!orderToCancel) return;

        get().showConfirm(
            'Cancel Order',
            `Are you sure you want to cancel your order for ${orderToCancel.product_name}?`,
            () => {
                set(state => ({
                    data: {
                        ...state.data,
                        my_orders: state.data.my_orders.filter(order => order.id !== orderId)
                    }
                }));
                get().showAlert('Order Cancelled', 'Your order has been successfully cancelled.');
            }
        );
    },

    logout: () => set({ currentUser: null, currentPage: 'auth', pageState: null }),
}));
