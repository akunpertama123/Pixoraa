import React from 'react';
import { Product } from '../types';
import { formatRupiah } from '../App';
import { PixoraLogoIcon, ShoppingBagIcon, FacebookIcon, TwitterIcon, InstagramIcon } from './Icons'; // Removed ArrowRightIcon

interface LobbyPageProps {
  storeName: string;
  products: Product[]; // Featured products
  onNavigateToAuth: () => void;
}

// Simple ArrowRightIcon if not already in Icons.tsx
const LocalArrowRightIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
);


const LobbyPage: React.FC<LobbyPageProps> = ({ storeName, products, onNavigateToAuth }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="py-6 px-4 sm:px-8 border-b border-slate-700/50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <PixoraLogoIcon className="h-10 w-auto" />
          </div>
          <button
            onClick={onNavigateToAuth}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-md shadow-md hover:shadow-lg transition-colors duration-200"
          >
            Masuk / Daftar
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-grow flex items-center justify-center py-16 sm:py-24 px-4">
        <div className="text-center container mx-auto max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
            Selamat Datang di <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">{storeName}</span>!
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-10">
            Solusi digital terpercaya untuk semua kebutuhan Anda. Dari produk berkualitas hingga layanan profesional, kami hadir untuk Anda.
          </p>
          <button
            onClick={onNavigateToAuth}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white text-lg font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto"
          >
            Dapatkan Sekarang!
            <LocalArrowRightIcon className="w-5 h-5 ml-2" />
          </button>
        </div>
      </section>

      {/* Featured Products Section */}
      {products.length > 0 && (
        <section className="py-16 sm:py-20 bg-slate-800/30 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Produk Unggulan Kami
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map(product => (
                <div key={product.id} className="bg-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col border border-slate-700 transition-all duration-300 hover:shadow-purple-500/20">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-52 object-cover" 
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/400/300?blur=2'; }}
                  />
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-gray-100 mb-2 truncate" title={product.name}>{product.name}</h3>
                    <p className="text-gray-400 text-sm mb-3 flex-grow min-h-[40px]">
                        {product.description.length > 70 ? `${product.description.substring(0, 67)}...` : product.description}
                    </p>
                    <p className="text-xl font-bold text-emerald-400 mt-auto">{formatRupiah(product.price)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <button
                onClick={onNavigateToAuth}
                className="px-6 py-2.5 bg-slate-600 hover:bg-slate-500 text-white text-md font-semibold rounded-md shadow-md hover:shadow-lg transition-colors duration-200"
              >
                Lihat Semua Produk
              </button>
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-16 sm:py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-400">
            Tentang {storeName}
          </h2>
          <p className="text-md text-gray-300 leading-relaxed">
            Di {storeName}, kami berkomitmen untuk menyediakan produk dan layanan digital berkualitas tinggi yang memenuhi kebutuhan modern Anda. Tim kami berdedikasi untuk memberikan pengalaman pelanggan terbaik, mulai dari kemudahan penelusuran produk hingga layanan purna jual yang responsif. Kami percaya pada inovasi, keandalan, dan kepuasan pelanggan. Jelajahi berbagai penawaran kami, termasuk layanan cek plagiarisme profesional untuk memastikan orisinalitas karya Anda.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-slate-900 border-t border-slate-700/50 px-4">
        <div className="container mx-auto text-center text-gray-400">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <PixoraLogoIcon className="h-8 w-auto" />
             <span className="text-lg font-semibold">{storeName}</span>
          </div>
          <p className="text-sm mb-2">Email: <a href="mailto:info@pixora.com" className="hover:text-blue-400">info@pixora.com</a></p>
          <p className="text-sm mb-4">Telepon: <a href="tel:+621234567890" className="hover:text-blue-400">+62 123 4567 890</a> (Contoh)</p>
          <div className="flex justify-center space-x-6 mb-6">
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors"><FacebookIcon className="w-6 h-6" /></a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors"><TwitterIcon className="w-6 h-6" /></a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors"><InstagramIcon className="w-6 h-6" /></a>
          </div>
          <p className="text-xs">&copy; {new Date().getFullYear()} {storeName}. Hak cipta dilindungi.</p>
        </div>
      </footer>
    </div>
  );
};

export default LobbyPage;