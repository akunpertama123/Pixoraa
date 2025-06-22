
import React from 'react';
import { Product } from '../types';
import { ShoppingCartIcon, ArrowLeftIcon, InformationCircleIcon, TagIcon, DocumentCheckIcon, CreditCardIcon } from './Icons';
import { formatRupiah } from '../App'; // Impor formatRupiah

interface ProductDetailViewProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onNavigateBack: () => void;
  defaultQrisImageUrl: string;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, onAddToCart, onNavigateBack, defaultQrisImageUrl }) => {
  return (
    <div className="bg-slate-800 shadow-2xl rounded-lg p-6 md:p-8 border border-slate-700">
      <button
        onClick={onNavigateBack}
        className="mb-6 flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200 text-sm"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Kembali ke Toko
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2">
          <img 
            src={product.imageUrl || 'https://picsum.photos/600/400?grayscale'} 
            alt={product.name} 
            className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-lg border border-slate-600"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/600/400?blur=2'; }}
          />
        </div>
        <div className="lg:w-1/2 flex flex-col">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-3 flex items-center">
            {product.name}
            {product.isTurnitinService && (
              <span className="ml-3 bg-purple-600 text-white text-xs px-2 py-1 rounded-full flex items-center shadow-md" title="Layanan Turnitin">
                <DocumentCheckIcon className="w-3 h-3 mr-1" />
                Turnitin
              </span>
            )}
          </h2>
          <p className="text-gray-400 text-md mb-6 leading-relaxed min-h-[80px]">{product.description}</p>
          
          <div className="my-6 flex items-center justify-between">
            <p className="text-4xl font-bold text-emerald-400 flex items-center">
              <TagIcon className="w-7 h-7 mr-2 opacity-80" />
              {formatRupiah(product.price)}
            </p>
            <button 
              onClick={() => onAddToCart(product)}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800"
              aria-label={`Tambah ${product.name} ke keranjang`}
            >
              <ShoppingCartIcon className="w-6 h-6" />
              <span>Tambah ke Keranjang</span>
            </button>
          </div>

          {product.isTurnitinService && (
            <div className="mt-auto space-y-6 pt-6 border-t border-slate-700">
              <div>
                <h3 className="text-xl font-semibold text-gray-200 mb-3 flex items-center">
                  <InformationCircleIcon className="w-6 h-6 mr-2 text-blue-400" />
                  Cara Pemesanan Layanan Turnitin
                </h3>
                <ol className="list-decimal list-inside space-y-1 text-gray-400 text-sm pl-2">
                  <li>Klik tombol "Tambah ke Keranjang" pada halaman ini.</li>
                  <li>Lanjutkan ke proses "Checkout" dari keranjang belanja Anda.</li>
                  <li>Setelah pesanan berhasil dibuat, buka menu "Pesanan Saya".</li>
                  <li>Pada detail pesanan terkait, Anda akan menemukan opsi untuk "Unggah Dokumen".</li>
                  <li>Unggah file Anda (format .doc, .docx, atau .pdf) yang ingin diperiksa.</li>
                </ol>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-200 mb-3 flex items-center">
                  <CreditCardIcon className="w-6 h-6 mr-2 text-emerald-400" />
                  Cara Pembayaran Layanan Turnitin
                </h3>
                <ol className="list-decimal list-inside space-y-1 text-gray-400 text-sm pl-2">
                  <li>Setelah Anda mengunggah dokumen, Admin akan memprosesnya.</li>
                  <li>Jika laporan Turnitin sudah siap, status pesanan Anda di "Pesanan Saya" akan berubah menjadi "Laporan Siap - Menunggu Pembayaran".</li>
                  <li>Anda akan melihat kode QRIS pada detail pesanan tersebut (contoh di bawah).</li>
                  <li>Lakukan pembayaran sejumlah <strong className="text-gray-200">{formatRupiah(product.price)}</strong> menggunakan aplikasi e-wallet atau mobile banking yang mendukung QRIS ke kode QRIS yang ditampilkan.</li>
                  <img src={defaultQrisImageUrl} alt="Contoh QRIS" className="my-2 w-32 h-32 rounded-md border border-slate-600" />
                  <li>Setelah melakukan pembayaran, klik tombol "Saya Sudah Bayar" pada halaman detail pesanan Anda.</li>
                  <li>Admin akan melakukan verifikasi pembayaran Anda (biasanya dalam beberapa jam kerja).</li>
                  <li>Setelah pembayaran dikonfirmasi oleh Admin, status pesanan akan berubah menjadi "Pembayaran Dikonfirmasi".</li>
                  <li>Anda dapat mengunduh file laporan Turnitin dari halaman "Pesanan Saya".</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;
