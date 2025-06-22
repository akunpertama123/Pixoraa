
import React from 'react';
import { ExclamationTriangleIcon, TrashIcon } from './Icons'; 

interface ConfirmationModalProps {
  message: string;
  productName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ message, productName, onConfirm, onCancel }) => {
  // Mencegah scroll di background ketika modal aktif
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 bg-slate-900 bg-opacity-80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      aria-labelledby="confirmation-modal-title"
    >
      <div className="bg-slate-800 rounded-lg shadow-xl p-6 md:p-8 w-full max-w-lg border border-slate-700 transform transition-all animate-fadeIn">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-500 mr-3 flex-shrink-0" />
            <h3 id="confirmation-modal-title" className="text-xl font-semibold text-gray-100">Konfirmasi Tindakan</h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-slate-700"
            aria-label="Tutup modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <p className="text-gray-300 mb-3">{message}</p>
        {productName && (
          <p className="text-sm text-gray-400 mb-6">Produk yang akan dihapus: <strong className="text-gray-200">{productName}</strong></p>
        )}
        
        <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-4 space-y-3 sm:space-y-0 mt-8">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-600 hover:bg-slate-500 text-white font-medium rounded-md shadow-sm hover:shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-800"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md shadow-sm hover:shadow-md transition-colors duration-200 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800"
          >
            <TrashIcon className="w-5 h-5" />
            <span>Ya, Hapus</span>
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ConfirmationModal;
