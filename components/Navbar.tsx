import React from 'react';
import { AppViewMode, User } from '../types';
import { EyeIcon, UserShieldIcon, ArrowLeftOnRectangleIcon, UserCircleIcon, ShoppingCartIcon, InboxStackIcon, ClipboardDocumentListIcon } from './Icons';

interface NavbarProps {
  currentAppView: AppViewMode;
  onNavigateAppView: (view: AppViewMode) => void;
  onLogout: () => void;
  currentUser: User | null;
  cartItemCount: number;
  storeName: string; // Added storeName prop
}

const Navbar: React.FC<NavbarProps> = ({ currentAppView, onNavigateAppView, onLogout, currentUser, cartItemCount, storeName }) => {
  const commonButtonStyles = "px-3 py-2 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 flex items-center space-x-2 relative";
  
  const getButtonStyles = (view: AppViewMode, baseColor: string) => {
    const activeColor = `bg-${baseColor}-500 hover:bg-${baseColor}-600 text-white shadow-lg transform hover:scale-105`;
    const inactiveColor = "bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white";
    return `${commonButtonStyles} ${currentAppView === view ? activeColor : inactiveColor} focus:ring-${baseColor}-500`;
  };

  const logoutButtonStyles = "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500";

  return (
    <nav className="bg-slate-900 shadow-lg border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <button onClick={() => onNavigateAppView(currentUser?.role === 'admin' ? 'admin_dashboard' : 'buyer')} className="focus:outline-none">
                 <h1 className="text-xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                    {storeName}
                </h1>
            </button>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            {currentUser && (
              <>
                <button
                  onClick={() => onNavigateAppView('buyer')}
                  className={getButtonStyles('buyer', 'blue')}
                  aria-label="Tampilan Pembeli"
                  title="Belanja"
                >
                  <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Belanja</span>
                </button>

                {currentUser.role === 'buyer' && (
                  <>
                    <button
                    onClick={() => onNavigateAppView('cart')}
                    className={`${getButtonStyles('cart', 'purple')} relative`}
                    aria-label="Keranjang Belanja"
                    title="Keranjang Belanja"
                    >
                      <ShoppingCartIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Keranjang</span>
                      {cartItemCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {cartItemCount}
                          </span>
                      )}
                    </button>
                    <button
                      onClick={() => onNavigateAppView('buyer_orders')}
                      className={getButtonStyles('buyer_orders', 'indigo')}
                      aria-label="Pesanan Saya"
                      title="Pesanan Saya"
                    >
                      <ClipboardDocumentListIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Pesanan Saya</span>
                    </button>
                  </>
                )}
                
                {currentUser.role === 'admin' && (
                  <>
                    <button
                        onClick={() => onNavigateAppView('admin_dashboard')}
                        className={getButtonStyles('admin_dashboard', 'emerald')}
                        aria-label="Dasbor Admin"
                        title="Dasbor Admin"
                    >
                        <UserShieldIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">Dasbor</span>
                    </button>
                    <button
                        onClick={() => onNavigateAppView('admin_orders')}
                        className={getButtonStyles('admin_orders', 'yellow')}
                        aria-label="Kelola Pesanan"
                        title="Kelola Pesanan"
                    >
                        <InboxStackIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">Pesanan</span>
                    </button>
                  </>
                )}
                 <div className="text-xs sm:text-sm text-gray-400 flex items-center border-l border-slate-700 pl-2 sm:pl-3 ml-1 sm:ml-2" title={currentUser.email}>
                  <UserCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-slate-500" />
                  <span className="truncate max-w-[70px] sm:max-w-[120px]">{currentUser.email}</span>
                </div>
                <button
                  onClick={onLogout}
                  className={`${commonButtonStyles} ${logoutButtonStyles}`}
                  aria-label="Keluar"
                  title="Keluar"
                >
                  <ArrowLeftOnRectangleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                   <span className="hidden sm:inline">Keluar</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;