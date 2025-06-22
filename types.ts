export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isTurnitinService?: boolean; // New: For Turnitin check product
}

export type UserRole = 'buyer' | 'admin';

export interface User {
  id: string;
  email: string;
  password?: string; 
  role: UserRole;
}

export interface CartItem extends Product {
  quantity: number;
}

// Consolidated OrderStatus, with specific statuses for Turnitin
export type OrderStatus = 
  // General statuses
  'Tertunda' | 
  'Diproses' | 
  'Dikirim' | 
  'Selesai' | 
  'Dibatalkan' |
  // Turnitin specific statuses
  'Menunggu Dokumen' |         // Order placed, buyer needs to upload their document
  'Dokumen Dikirim' |        // Buyer uploaded, admin to process
  'Dokumen Diproses' |       // Admin has acknowledged/is working on it
  'Laporan Siap - Menunggu Pembayaran' | // Admin uploaded Turnitin report, QRIS shown to buyer
  'Pembayaran Dikonfirmasi' |         // Admin verified payment, buyer can download report
  'Laporan Diunduh';          // Buyer has downloaded the report, effectively 'Completed' for Turnitin type

export interface UploadedFile {
  name: string;
  type: string;
  dataUrl: string;
  size: number; // Store original file size in bytes
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: CartItem[];
  totalAmount: number;
  orderDate: string;
  status: OrderStatus;
  isTurnitinOrder?: boolean;        // New: True if this order is for Turnitin service
  buyerUploadedFile?: UploadedFile; // New: For buyer's document
  adminUploadedReport?: UploadedFile; // New: For admin's Turnitin report
  qrisImageUrlForOrder?: string;    // New: Stores the QRIS URL active at time of order for payment
}

export interface AdminSettings {
  qrisImageUrl?: string;
}

export type AuthViewMode = 'login' | 'register';
// AppViewMode will include 'buyer_orders' and 'product_detail'
export type AppViewMode = 'buyer' | 'admin_dashboard' | 'cart' | 'admin_orders' | 'buyer_orders' | 'product_detail'; 

export type CurrentView = AuthViewMode | AppViewMode | 'lobby'; // Added 'lobby'