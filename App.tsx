import React, { useState, useCallback, useEffect } from 'react';
import { Product, User, AuthViewMode, AppViewMode, CurrentView, CartItem, Order, OrderStatus, UploadedFile, AdminSettings } from './types';
import Navbar from './components/Navbar';
import AdminProductUploadForm from './components/AdminProductUploadForm';
import ProductCard from './components/ProductCard';
import AuthForm from './components/AuthForm';
import CartView from './components/CartView';
import AdminOrdersView from './components/AdminOrdersView';
import BuyerOrdersView from './components/BuyerOrdersView';
import AdminSettingsComponent from './components/AdminSettingsComponent';
import ProductDetailView from './components/ProductDetailView';
import ConfirmationModal from './components/ConfirmationModal';
import LobbyPage from './components/LobbyPage'; // Ensured correct relative path
import { EyeIcon, UserShieldIcon, ShoppingBagIcon, UserCircleIcon, InboxStackIcon, Cog6ToothIcon, PlusCircleIcon, DocumentArrowUpIcon, DocumentArrowDownIcon, DocumentCheckIcon, CreditCardIcon as PaymentIcon } from './components/Icons';

// Fungsi untuk memformat angka menjadi Rupiah
export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const initialProducts: Product[] = [
  { id: '1', name: 'Jam Tangan Modern', description: 'Jam tangan modern yang ramping dan bergaya untuk dipakai sehari-hari.', price: 1500000, imageUrl: 'https://picsum.photos/seed/watch/400/300' },
  { id: '2', name: 'Headphone Nirkabel', description: 'Headphone nirkabel berkualitas tinggi dengan peredam bising.', price: 850000, imageUrl: 'https://picsum.photos/seed/headphones/400/300' },
  { id: '3', name: 'Tas Ransel Kulit', description: 'Tas ransel kulit yang tahan lama dan modis untuk semua kebutuhan Anda.', price: 650000, imageUrl: 'https://picsum.photos/seed/backpack/400/300' },
  { id: 'turnitin001', name: 'Cek Plagiarisme Turnitin', description: 'Layanan profesional untuk pemeriksaan plagiarisme menggunakan Turnitin. Cocok untuk mahasiswa, peneliti, dan penulis yang membutuhkan jaminan orisinalitas karya tulis. Proses cepat dan laporan detail disediakan. Unggah dokumen Anda (DOC, DOCX, PDF) dan dapatkan hasilnya setelah diproses dan pembayaran dikonfirmasi.', price: 75000, imageUrl: 'https://picsum.photos/seed/turnitin_service/400/300', isTurnitinService: true },
  { id: '4', name: 'Kamera Mirrorless Pro', description: 'Kamera mirrorless dengan sensor full-frame untuk hasil foto dan video profesional.', price: 22500000, imageUrl: 'https://picsum.photos/seed/camera_pro/400/300' },
  { id: '5', name: 'Smart Speaker Mini', description: 'Speaker pintar dengan asisten suara terintegrasi, suara jernih dan bass mendalam.', price: 599000, imageUrl: 'https://picsum.photos/seed/speaker_mini/400/300' },
];

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin";
const DEFAULT_QRIS_IMAGE_URL = 'https://picsum.photos/seed/sampleQR/250/250';
const STORE_NAME = "Pixora";

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const downloadFile = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : initialProducts;
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [currentView, setCurrentView] = useState<CurrentView>('lobby'); // Default to lobby
  const [authError, setAuthError] = useState<string | null>(null);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    const savedSettings = localStorage.getItem('adminSettings');
    return savedSettings ? JSON.parse(savedSettings) : { qrisImageUrl: DEFAULT_QRIS_IMAGE_URL };
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductFormVisible, setIsProductFormVisible] = useState(false);

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState<string | null>(null);


  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
    } else {
      const adminUserForStorage: User = { id: 'admin_user', email: ADMIN_EMAIL, role: 'admin' };
      const initialUserList = [{ ...adminUserForStorage, password: ADMIN_PASSWORD }];
      setUsers(initialUserList);
      localStorage.setItem('users', JSON.stringify(initialUserList.map(u => u.email === ADMIN_EMAIL ? adminUserForStorage : u)));
    }

    const storedCurrentUser = localStorage.getItem('currentUser');
    if (storedCurrentUser) {
      const parsedUser = JSON.parse(storedCurrentUser) as User;
      setCurrentUser(parsedUser);
      setCurrentView(parsedUser.role === 'admin' ? 'admin_dashboard' : 'buyer');
      const storedCart = localStorage.getItem(`cart_${parsedUser.id}`);
      if (storedCart) setCartItems(JSON.parse(storedCart));
    } else {
      setCurrentView('lobby'); // Ensure lobby view if no user
    }

    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) setOrders(JSON.parse(storedOrders));

    const storedAdminSettings = localStorage.getItem('adminSettings');
    if (storedAdminSettings) {
      setAdminSettings(JSON.parse(storedAdminSettings));
    } else {
      setAdminSettings({ qrisImageUrl: DEFAULT_QRIS_IMAGE_URL });
    }
  }, []);

  useEffect(() => { localStorage.setItem('products', JSON.stringify(products)); }, [products]);
  useEffect(() => { if (currentUser) localStorage.setItem(`cart_${currentUser.id}`, JSON.stringify(cartItems));}, [cartItems, currentUser]);
  useEffect(() => { localStorage.setItem('orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('adminSettings', JSON.stringify(adminSettings)); }, [adminSettings]);

  // Fetch orders from backend API for admin
  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetch('http://localhost:3001/orders')
        .then(res => res.json())
        .then((data: Order[]) => {
          setOrders(data);
        })
        .catch(() => {
          // fallback or error handling
        });
    }
  }, [currentUser]);

  const handleAddNewProductClick = () => {
    setEditingProduct(null);
    setIsProductFormVisible(true);
  };

  const handleEditProductClick = (product: Product) => {
    setEditingProduct(product);
    setIsProductFormVisible(true);
  };

  const handleDeleteProductClick = (productId: string) => {
    setProductIdToDelete(productId);
    setShowDeleteConfirmModal(true);
  };

  const handleConfirmActualDelete = () => {
    if (productIdToDelete) {
      setProducts(prevProducts => prevProducts.filter(p => p.id !== productIdToDelete));
    }
    setShowDeleteConfirmModal(false);
    setProductIdToDelete(null);
  };

  const handleCancelCustomDelete = () => {
    setShowDeleteConfirmModal(false);
    setProductIdToDelete(null);
  };

  const handleSaveProductForm = (productData: Product | Omit<Product, 'id'>) => {
    if ('id' in productData) { 
      setProducts(prevProducts => prevProducts.map(p => p.id === productData.id ? productData : p));
    } else { 
      setProducts(prevProducts => [
        ...prevProducts,
        { ...productData, id: Date.now().toString(), isTurnitinService: productData.isTurnitinService || false }
      ]);
    }
    setIsProductFormVisible(false);
    setEditingProduct(null);
  };
  
  const handleCancelProductForm = () => {
    setIsProductFormVisible(false);
    setEditingProduct(null);
  };

  const handleLogin = useCallback((email: string, password_param: string) => {
    setAuthError(null);
    const isAdminLoginAttempt = email === ADMIN_EMAIL && password_param === ADMIN_PASSWORD;

    if (isAdminLoginAttempt) {
        const adminUser: User = { id: 'admin_user', email: ADMIN_EMAIL, role: 'admin' };
        setCurrentUser(adminUser);
        setCurrentView('admin_dashboard');
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        const storedCart = localStorage.getItem(`cart_${adminUser.id}`);
        setCartItems(storedCart ? JSON.parse(storedCart) : []);
        return;
    }

    // Call backend login API
    fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: password_param }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Login failed');
        return res.json();
      })
      .then((user: User) => {
        if (user.role === 'buyer') {
          setCurrentUser({ id: user.id.toString(), email: user.email, role: user.role });
          setCurrentView('buyer');
          localStorage.setItem('currentUser', JSON.stringify({ id: user.id.toString(), email: user.email, role: user.role }));
          const storedCart = localStorage.getItem(`cart_${user.id}`);
          setCartItems(storedCart ? JSON.parse(storedCart) : []);
        } else {
          setAuthError('Email atau kata sandi salah.');
        }
      })
      .catch(() => {
        setAuthError('Email atau kata sandi salah.');
      });
  }, []);

  const handleRegister = useCallback((email: string, password_param: string) => {
    setAuthError(null);

    // Call backend register API
    fetch('http://localhost:3001/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: password_param, role: 'buyer' }),
    })
      .then(res => {
        if (res.status === 409) {
          throw new Error('Email sudah terdaftar.');
        }
        if (!res.ok) {
          throw new Error('Registrasi gagal.');
        }
        return res.json();
      })
      .then(() => {
        // After successful registration, auto-login
        handleLogin(email, password_param);
      })
      .catch((err) => {
        setAuthError(err.message);
      });
  }, [handleLogin]);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setCurrentView('lobby'); // Back to lobby on logout
    setCartItems([]);
    setSelectedProduct(null);
    setIsProductFormVisible(false);
    setEditingProduct(null);
    setShowDeleteConfirmModal(false); 
    setProductIdToDelete(null);     
    localStorage.removeItem('currentUser');
  }, []);

  const navigateAppView = useCallback((view: AppViewMode) => {
    if (currentUser) {
      if ((view === 'admin_dashboard' || view === 'admin_orders') && currentUser.role !== 'admin') {
        setCurrentView('buyer');
      } else if (view === 'buyer_orders' && currentUser.role !== 'buyer') {
        setCurrentView('admin_dashboard');
      } else {
        setCurrentView(view);
      }
      if (view !== 'product_detail') {
        setSelectedProduct(null);
      }
      if (view !== 'admin_dashboard') { 
        setIsProductFormVisible(false);
        setEditingProduct(null);
      }
    }
  }, [currentUser]);

  const navigateAuthView = useCallback((view: AuthViewMode) => {
    setCurrentUser(null); // Ensure user is logged out
    setCurrentView(view);
    setAuthError(null);
    // Clear other states as well
    setCartItems([]);
    setSelectedProduct(null);
    setIsProductFormVisible(false);
    setEditingProduct(null);
    setShowDeleteConfirmModal(false);
    setProductIdToDelete(null);
  }, []);
  
  const handleNavigateToAuthFromLobby = useCallback(() => {
    navigateAuthView('login');
  }, [navigateAuthView]);

  const handleViewProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product_detail');
  };

  const handleNavigateBackFromDetail = () => {
    setSelectedProduct(null);
    setCurrentView('buyer');
  };


  const handleAddToCart = useCallback((product: Product) => {
    if (!currentUser) { alert("Silakan masuk untuk menambahkan item ke keranjang Anda."); return; }
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  }, [currentUser]);

  const handleRemoveFromCart = useCallback((productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  }, []);

  const handleUpdateCartQuantity = useCallback((productId: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter(item => item.quantity > 0)
    );
  }, []);

  const handleCheckout = useCallback(() => {
    if (!currentUser || cartItems.length === 0) return;

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const isTurnitinOrder = cartItems.some(item => item.isTurnitinService);
    
    const newOrder: Order = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userEmail: currentUser.email,
      items: [...cartItems],
      totalAmount,
      orderDate: new Date().toISOString(),
      status: isTurnitinOrder ? 'Menunggu Dokumen' : 'Tertunda',
      isTurnitinOrder: isTurnitinOrder,
      qrisImageUrlForOrder: isTurnitinOrder ? (adminSettings.qrisImageUrl || DEFAULT_QRIS_IMAGE_URL) : undefined,
    };
    // Send order to backend
    fetch('http://localhost:3001/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),
    }).then(() => {
      setOrders(prevOrders => [...prevOrders, newOrder]);
      setCartItems([]);
      alert('Pesanan berhasil dibuat!');
      setCurrentView(isTurnitinOrder && currentUser.role === 'buyer' ? 'buyer_orders' : 'buyer');
      setSelectedProduct(null);
    }).catch(() => {
      alert('Gagal membuat pesanan. Silakan coba lagi.');
    });
  }, [currentUser, cartItems, adminSettings.qrisImageUrl]);

  const handleUpdateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    // Update backend first
    fetch(`http://localhost:3001/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).then(() => {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    }).catch(() => {
      // error handling
    });
  }, []);

  const handleSaveAdminSettings = useCallback((settings: AdminSettings) => {
    setAdminSettings(settings);
  }, []);

  const handleBuyerUploadDocument = useCallback((orderId: string, file: UploadedFile) => {
    setOrders(prevOrders => prevOrders.map(order =>
      order.id === orderId && order.isTurnitinOrder ?
      { ...order, buyerUploadedFile: file, status: 'Dokumen Dikirim' } : order
    ));
  }, []);

  const handleAdminUploadReport = useCallback((orderId: string, file: UploadedFile) => {
     setOrders(prevOrders => prevOrders.map(order =>
      order.id === orderId && order.isTurnitinOrder ?
      { ...order, adminUploadedReport: file, status: 'Laporan Siap - Menunggu Pembayaran' } : order
    ));
  }, []);
  
  const handleAdminConfirmPayment = useCallback((orderId: string) => {
    setOrders(prevOrders => prevOrders.map(order =>
      order.id === orderId && order.isTurnitinOrder ?
      { ...order, status: 'Pembayaran Dikonfirmasi' } : order
    ));
  }, []);

  const handleBuyerReportDownloaded = useCallback((orderId: string) => {
    setOrders(prevOrders => prevOrders.map(order =>
      order.id === orderId && order.isTurnitinOrder ?
      { ...order, status: 'Laporan Diunduh' } : order
    ));
  }, []);


  if (!currentUser && currentView === 'lobby') {
    return (
      <LobbyPage
        storeName={STORE_NAME}
        products={initialProducts.slice(0, 4)} // Display first 4 products as featured
        onNavigateToAuth={handleNavigateToAuthFromLobby}
      />
    );
  }

  if (!currentUser && (currentView === 'login' || currentView === 'register')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-gray-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AuthForm
            mode={currentView as AuthViewMode}
            onLogin={handleLogin}
            onRegister={handleRegister}
            onSwitchMode={currentView === 'login' ? () => navigateAuthView('register') : () => navigateAuthView('login')}
            error={authError}
          />
        </div>
      </div>
    );
  }
  
  if (!currentUser) { // Should not happen if logic above is correct, but as a fallback
    return <LobbyPage storeName={STORE_NAME} products={initialProducts.slice(0,4)} onNavigateToAuth={handleNavigateToAuthFromLobby} />;
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-gray-100 flex flex-col">
      <Navbar
        currentAppView={currentView as AppViewMode}
        onNavigateAppView={navigateAppView}
        onLogout={handleLogout}
        currentUser={currentUser}
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        storeName={STORE_NAME}
      />
      
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {currentView === 'admin_dashboard' && currentUser.role === 'admin' && (
          <div className="space-y-8">
            <div className="bg-slate-800 shadow-xl rounded-lg p-6 border border-slate-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 flex items-center">
                  <UserShieldIcon className="w-8 h-8 mr-3" />
                  Panel Admin
                </h2>
                {!isProductFormVisible && (
                    <button 
                        onClick={handleAddNewProductClick}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition-colors duration-200 flex items-center"
                    >
                        <PlusCircleIcon className="w-5 h-5 mr-2" />
                        Tambah Produk Baru
                    </button>
                )}
              </div>
              {isProductFormVisible && (
                <AdminProductUploadForm 
                    initialData={editingProduct}
                    onSave={handleSaveProductForm}
                    onCancel={handleCancelProductForm}
                />
              )}
            </div>

            {!isProductFormVisible && (
              <>
                <div className="bg-slate-800 shadow-xl rounded-lg p-6 border border-slate-700">
                    <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 flex items-center">
                        <Cog6ToothIcon className="w-8 h-8 mr-3" />
                        Pengaturan Admin
                    </h2>
                    <AdminSettingsComponent settings={adminSettings} onSave={handleSaveAdminSettings} />
                </div>
                <div className="bg-slate-800 shadow-xl rounded-lg p-6 border border-slate-700">
                  <h3 className="text-2xl font-semibold mb-6 text-gray-200 flex items-center">
                    <ShoppingBagIcon className="w-7 h-7 mr-3 text-emerald-400" />
                    Produk Tersedia
                  </h3>
                  {products.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">Belum ada produk yang ditambahkan.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {products.map(product => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            isAdminView={true} 
                            onAddToCart={() => {}} 
                            onEdit={handleEditProductClick}
                            onDelete={handleDeleteProductClick}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {currentView === 'buyer' && (
          <div>
            <h2 className="text-4xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 flex items-center justify-center">
              <EyeIcon className="w-10 h-10 mr-3" />
              Temukan Produk Kami
            </h2>
            {products.length === 0 ? (
              <div className="text-center py-10">
                <ShoppingBagIcon className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                <p className="text-xl text-gray-400">Tidak ada produk tersedia. Silakan cek kembali nanti!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onViewDetails={handleViewProductDetail}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {currentView === 'cart' && (
          <CartView
            items={cartItems}
            onRemoveItem={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onCheckout={handleCheckout}
            onNavigateToBuyer={() => navigateAppView('buyer')}
          />
        )}
        
        {currentView === 'admin_orders' && currentUser.role === 'admin' && (
            <AdminOrdersView
                orders={orders}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onAdminUploadReport={handleAdminUploadReport}
                onAdminConfirmPayment={handleAdminConfirmPayment}
                formatFileSize={formatFileSize}
                downloadFile={downloadFile}
            />
        )}
        
        {currentView === 'buyer_orders' && currentUser.role === 'buyer' && (
            <BuyerOrdersView
                orders={orders.filter(o => o.userId === currentUser?.id)}
                onBuyerUploadDocument={handleBuyerUploadDocument}
                onReportDownloaded={handleBuyerReportDownloaded}
                formatFileSize={formatFileSize}
                downloadFile={downloadFile}
                onNavigateToShop={() => navigateAppView('buyer')}
            />
        )}
        
        {currentView === 'product_detail' && selectedProduct && (
          <ProductDetailView
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            onNavigateBack={handleNavigateBackFromDetail}
            defaultQrisImageUrl={adminSettings.qrisImageUrl || DEFAULT_QRIS_IMAGE_URL}
          />
        )}

         {showDeleteConfirmModal && productIdToDelete && (
          <ConfirmationModal
            message="Apakah Anda yakin ingin menghapus produk ini secara permanen? Tindakan ini tidak dapat dibatalkan."
            productName={products.find(p => p.id === productIdToDelete)?.name}
            onConfirm={handleConfirmActualDelete}
            onCancel={handleCancelCustomDelete}
          />
        )}

         {(currentView === 'admin_dashboard' || currentView === 'admin_orders') && currentUser.role === 'buyer' && (
            <div className="text-center py-10">
                <UserCircleIcon className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                <p className="text-xl text-gray-400">Mengalihkan ke tampilan pembeli...</p>
                { setTimeout(() => navigateAppView('buyer'), 100)}
            </div>
         )}
          {currentView === 'buyer_orders' && currentUser.role === 'admin' && (
            <div className="text-center py-10">
                <UserCircleIcon className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                <p className="text-xl text-gray-400">Mengalihkan ke dasbor admin...</p>
                { setTimeout(() => navigateAppView('admin_dashboard'), 100)}
            </div>
         )}
      </main>

      <footer className="bg-slate-900 text-center p-4 border-t border-slate-700 mt-auto">
        <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} {STORE_NAME}. Hak cipta dilindungi.</p>
      </footer>
    </div>
  );
};

export default App;
