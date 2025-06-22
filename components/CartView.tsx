
import React from 'react';
import { CartItem } from '../types';
import { TrashIcon, ShoppingCartIcon, ArrowUturnLeftIcon, CreditCardIcon, MinusIcon, PlusIcon } from './Icons';
import { formatRupiah } from '../App'; // Impor formatRupiah

interface CartViewProps {
  items: CartItem[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onCheckout: () => void;
  onNavigateToBuyer: () => void;
}

const CartView: React.FC<CartViewProps> = ({ items, onRemoveItem, onUpdateQuantity, onCheckout, onNavigateToBuyer }) => {
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="text-center py-10 bg-slate-800 rounded-lg shadow-xl border border-slate-700 p-8">
        <ShoppingCartIcon className="w-24 h-24 mx-auto text-slate-500 mb-6" />
        <h2 className="text-3xl font-semibold text-gray-200 mb-4">Keranjang Anda Kosong</h2>
        <p className="text-gray-400 mb-8">Sepertinya Anda belum menambahkan apa pun ke keranjang.</p>
        <button
          onClick={onNavigateToBuyer}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition-colors duration-200 flex items-center justify-center mx-auto"
        >
          <ArrowUturnLeftIcon className="w-5 h-5 mr-2" />
          Lanjut Belanja
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 shadow-xl rounded-lg p-6 md:p-8 border border-slate-700">
      <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 flex items-center">
        <ShoppingCartIcon className="w-8 h-8 sm:w-10 sm:h-10 mr-3" />
        Keranjang Belanja Anda
      </h2>
      
      <div className="space-y-6 mb-8">
        {items.map(item => (
          <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between bg-slate-700/50 p-4 rounded-lg border border-slate-600 shadow-md">
            <div className="flex items-center mb-4 sm:mb-0">
              <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md mr-4 border border-slate-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-100">{item.name}</h3>
                <p className="text-sm text-emerald-400">{formatRupiah(item.price)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center border border-slate-500 rounded-md">
                <button 
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} 
                  className="p-2 text-gray-300 hover:bg-slate-600 rounded-l-md disabled:opacity-50"
                  disabled={item.quantity <= 1}
                  aria-label="Kurangi jumlah"
                >
                  <MinusIcon className="w-5 h-5" />
                </button>
                <span className="px-3 py-1 text-gray-200 tabular-nums">{item.quantity}</span>
                <button 
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} 
                  className="p-2 text-gray-300 hover:bg-slate-600 rounded-r-md"
                  aria-label="Tambah jumlah"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>
              <p className="text-lg font-medium text-gray-200 w-32 text-right">{formatRupiah(item.price * item.quantity)}</p>
              <button 
                onClick={() => onRemoveItem(item.id)} 
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-md transition-colors duration-200"
                aria-label={`Hapus ${item.name} dari keranjang`}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-600 pt-6 mt-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-xl sm:text-2xl font-semibold text-gray-200">Subtotal:</p>
          <p className="text-xl sm:text-2xl font-bold text-emerald-400">{formatRupiah(totalAmount)}</p>
        </div>
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
           <button
            onClick={onNavigateToBuyer}
            className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition-colors duration-200 flex items-center justify-center"
            >
            <ArrowUturnLeftIcon className="w-5 h-5 mr-2" />
            Lanjut Belanja
            </button>
          <button
            onClick={onCheckout}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
          >
            <CreditCardIcon className="w-5 h-5 mr-2" />
            Lanjut ke Checkout (Simulasi)
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartView;
