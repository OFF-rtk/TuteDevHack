// src/App.tsx
// import React, { useState } from 'react';
// import { User, AppData, GroupBuy, MyOrder } from './types';
// import { initialDummyData } from './lib/data';

// import { Navbar } from './components/layout/Navbar';
// import AuthPage from './components/features/AuthPage';
// import VendorDashboard from './components/features/VendorDashboard';
// import ProductsPage from './components/features/ProductsPage';
// import GroupDetailsPage from './components/features/GroupDetailsPage';
// import MyOrdersPage from './components/features/MyOrdersPage';
// import SupplierDashboard from './components/features/SupplierDashboard';

// import AlertModal from './components/ui/AlertModal';
// import ConfirmModal from './components/ui/ConfirmModal';
// import QuantityModal from './components/ui/QuantityModal';


// const App = () => {
//     const [currentUser, setCurrentUser] = useState<User | null>(null);
//     const [currentPage, setCurrentPage] = useState('auth'); // 'auth', 'dashboard', etc.
//     const [pageState, setPageState] = useState<any>(null); // For passing state between pages
//     const [data, setData] = useState<AppData>(initialDummyData);
//     const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '', onOk: () => {} });
//     const [confirmModalState, setConfirmModalState] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
//     const [quantityModalState, setQuantityModalState] = useState<{ isOpen: boolean, groupBuy: GroupBuy | null }>({ isOpen: false, groupBuy: null });

//     const showAlert = (title: string, message: string, onOk?: () => void) => {
//         setModalState({
//             isOpen: true,
//             title,
//             message,
//             onOk: () => {
//                 setModalState({ isOpen: false, title: '', message: '', onOk: () => {} });
//                 if (onOk) onOk();
//             }
//         });
//     };

//     const showConfirm = (title: string, message: string, onConfirm: () => void) => {
//         setConfirmModalState({
//             isOpen: true,
//             title,
//             message,
//             onConfirm: () => {
//                 setConfirmModalState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
//                 onConfirm();
//             }
//         });
//     };

//     const handleAuth = (user: User) => {
//         setCurrentUser(user);
//         setCurrentPage(user.role === 'VENDOR' ? 'dashboard' : 'supplier-dashboard');
//     };

//     const handleLogout = () => {
//         setCurrentUser(null);
//         setCurrentPage('auth');
//         setPageState(null);
//     };

//     const handleAddOrder = (groupBuy: GroupBuy, quantity: number) => {
//         const newOrder: MyOrder = {
//             id: `order_${new Date().getTime()}`,
//             group_buy_id: groupBuy.id,
//             product_name: groupBuy.product.name,
//             quantity: quantity,
//             unit: groupBuy.product.unit,
//             status: 'PENDING',
//             delivery_details: 'Awaiting group buy completion',
//             createdAt: new Date().toISOString()
//         };

//         setData(prevData => ({
//             ...prevData,
//             my_orders: [newOrder, ...prevData.my_orders],
//             group_buys: prevData.group_buys.map(gb => 
//                 gb.id === groupBuy.id 
//                 ? { ...gb, current_quantity: gb.current_quantity + quantity, participants: gb.participants + 1 } 
//                 : gb
//             )
//         }));
        
//         setQuantityModalState({ isOpen: false, groupBuy: null });
//         showAlert(
//             'Order Placed!',
//             `Your order for ${quantity} ${groupBuy.product.unit} of ${groupBuy.product.name} has been submitted. You have 30 minutes to cancel.`,
//             () => navigate('my-orders')
//         );
//     };

//     const handleCancelOrder = (orderId: string) => {
//         const orderToCancel = data.my_orders.find(o => o.id === orderId);
//         if (!orderToCancel) return;

//         showConfirm(
//             'Cancel Order',
//             `Are you sure you want to cancel your order for ${orderToCancel.product_name}?`,
//             () => {
//                 setData(prevData => ({
//                     ...prevData,
//                     my_orders: prevData.my_orders.filter(order => order.id !== orderId)
//                 }));
//                 showAlert('Order Cancelled', 'Your order has been successfully cancelled.');
//             }
//         );
//     };
    
//     const navigate = (page: string, state: any = null) => {
//         setCurrentPage(page);
//         setPageState(state);
//         window.scrollTo(0, 0);
//     }
    
//     const renderPage = () => {
//         if (!currentUser) {
//             return <AuthPage handleAuth={handleAuth} />;
//         }
        
//         switch (currentPage) {
//             case 'dashboard':
//                 return <VendorDashboard groupBuys={data.group_buys} navigate={navigate} user={currentUser} />;
//             case 'products':
//                 return <ProductsPage groupBuys={data.group_buys} navigate={navigate} />;
//             case 'group-details':
//                 const groupBuy = data.group_buys.find(gb => gb.id === pageState?.groupId);
//                 if (!groupBuy) return <p>Group not found</p>;
//                 const supplierName = data.suppliers[groupBuy.supplier_id]?.name || "Unknown Supplier";
//                 return <GroupDetailsPage groupBuy={groupBuy} supplierName={supplierName} navigate={navigate} onPlaceOrderClick={(gb) => setQuantityModalState({ isOpen: true, groupBuy: gb })} />;
//             case 'my-orders':
//                 return <MyOrdersPage myOrders={data.my_orders} onCancelOrder={handleCancelOrder} />;
//             case 'supplier-dashboard':
//                 return <SupplierDashboard groupBuys={data.group_buys} user={currentUser} />;
//             default:
//                 return <AuthPage handleAuth={handleAuth} />;
//         }
//     };

//     return (
//         <>
//             <style>
//                 {`
//                 @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Poppins:wght@700;800&display=swap');
//                 .animate-fade-in { animation: fadeIn 0.5s ease-in-out forwards; opacity: 0; }
//                 .animate-fade-out { animation: fadeOut 0.5s ease-in-out forwards; }
//                 .animate-fade-in-up { animation: fadeInUp 0.8s ease-in-out forwards; opacity: 0; }
//                 @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
//                 @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; visibility: hidden; } }
//                 @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
//                 `}
//             </style>
//             <div className="max-w-lg mx-auto bg-white min-h-screen shadow-2xl relative" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
//                 {currentUser && (
//                     <Navbar
//                         user={currentUser}
//                         navigate={navigate}
//                         handleLogout={handleLogout}
//                         currentPage={currentPage}
//                     />
//                 )}
//                 <main>{renderPage()}</main>
//                 <AlertModal
//                     isOpen={modalState.isOpen}
//                     onClose={modalState.onOk}
//                     title={modalState.title}
//                 >
//                     {modalState.message}
//                 </AlertModal>
//                 <ConfirmModal
//                     isOpen={confirmModalState.isOpen}
//                     onClose={() => setConfirmModalState({ ...confirmModalState, isOpen: false })}
//                     onConfirm={confirmModalState.onConfirm}
//                     title={confirmModalState.title}
//                 >
//                     {confirmModalState.message}
//                 </ConfirmModal>
//                 <QuantityModal
//                     isOpen={quantityModalState.isOpen}
//                     onClose={() => setQuantityModalState({ isOpen: false, groupBuy: null })}
//                     onConfirm={(quantity) => handleAddOrder(quantityModalState.groupBuy!, quantity)}
//                     groupBuy={quantityModalState.groupBuy}
//                 />
//                 {currentUser?.role === 'VENDOR' && currentPage !== 'auth' && (
//                      <button className="fixed bottom-6 right-6 bg-orange-500 text-white w-16 h-16 rounded-full shadow-xl flex items-center justify-center z-20 transform transition-transform hover:scale-105 active:scale-95">
//                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
//                              <path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4z" /><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm5 8.25V14a.75.75 0 01-1.5 0v-1.75a5.506 5.506 0 00-5-5.419V4a5 5 0 1110 0v2.831A5.506 5.506 0 0012 12.25z" clipRule="evenodd" />
//                          </svg>
//                      </button>
//                 )}
//             </div>
//         </>
//     );
// };

// export default App;