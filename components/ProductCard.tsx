
import React from 'react';
import { Product } from '../types';
import { TagIcon, ShoppingCartIcon, DocumentCheckIcon, EyeIcon, PencilSquareIcon, TrashIcon } from './Icons';
import { formatRupiah } from '../App'; // Impor formatRupiah

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isAdminView?: boolean;
  onViewDetails?: (product: Product) => void;
  onEdit?: (product: Product) => void; // New prop for editing
  onDelete?: (productId: string) => void; // New prop for deleting
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, isAdminView = false, onViewDetails, onEdit, onDelete }) => {
  return (
    <div className="bg-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-blue-500/30 hover:transform hover:-translate-y-1 border border-slate-700 relative">
      {product.isTurnitinService && (
        <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full flex items-center shadow-lg z-10" title="Layanan Turnitin">
          <DocumentCheckIcon className="w-3 h-3 mr-1" />
          <span>Turnitin</span>
        </div>
      )}
      <img 
        src={product.imageUrl || 'https://picsum.photos/400/300?grayscale'} 
        alt={product.name} 
        className="w-full h-56 object-cover cursor-pointer"
        onClick={() => !isAdminView && onViewDetails && onViewDetails(product)}
        onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/400/300?blur=2'; }}
      />
      <div className="p-5 flex flex-col flex-grow">
        <h3 
          className="text-xl font-semibold text-gray-100 mb-2 truncate cursor-pointer hover:text-blue-300 transition-colors" 
          title={product.name}
          onClick={() => !isAdminView && onViewDetails && onViewDetails(product)}
        >
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm mb-4 flex-grow min-h-[60px]">
          {product.description.length > 100 ? `${product.description.substring(0, 97)}...` : product.description}
        </p>
        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-emerald-400 flex items-center">
              <TagIcon className="w-5 h-5 mr-2 opacity-80" />
              {formatRupiah(product.price)}
            </p>
            {isAdminView && (
                <span className="text-xs px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">Admin</span>
            )}
          </div>
          
          {isAdminView && onEdit && onDelete && (
            <div className="flex items-center space-x-2 pt-2 border-t border-slate-700/50">
              <button 
                onClick={() => onEdit(product)}
                className="flex-1 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-medium rounded-md shadow-sm transition-colors duration-200 flex items-center justify-center space-x-1"
                aria-label={`Edit ${product.name}`}
              >
                <PencilSquareIcon className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button 
                onClick={() => onDelete(product.id)}
                className="flex-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-md shadow-sm transition-colors duration-200 flex items-center justify-center space-x-1"
                aria-label={`Hapus ${product.name}`}
              >
                <TrashIcon className="w-4 h-4" />
                <span>Hapus</span>
              </button>
            </div>
          )}

          {!isAdminView && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
              <button 
                onClick={() => onAddToCart(product)}
                className="w-full sm:flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800"
                aria-label={`Tambah ${product.name} ke keranjang`}
              >
                <ShoppingCartIcon className="w-5 h-5" />
                <span>Tambah</span>
              </button>
              {onViewDetails && (
                 <button 
                    onClick={() => onViewDetails(product)}
                    className="w-full sm:flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white text-sm font-medium rounded-md shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-800"
                    aria-label={`Lihat detail ${product.name}`}
                  >
                    <EyeIcon className="w-5 h-5" />
                    <span>Detail</span>
                  </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
