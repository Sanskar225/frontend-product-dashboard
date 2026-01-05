import { useState, useEffect, useMemo, useCallback } from 'react';
import { Moon, Sun } from 'lucide-react';
import ThreeBackground from './components/ThreeBackground';
import Analytics from './components/Analytics';
import Toolbar from './components/Toolbar';
import ListView from './components/ListView';
import CardView from './components/CardView';
import Pagination from './components/Pagination';
import Modal from './components/Modal';
import ProductForm from './components/ProductForm';
import Toast, { ToastData } from './components/Toast';
import { Product, loadProducts, saveProducts } from './utils/storage';
import { getUniqueCategories, filterProducts, sortProducts, calculateAnalytics, generateId } from './utils/helpers';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');
  const [viewMode, setViewMode] = useState<'list' | 'card'>('card');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    const loadedProducts = loadProducts();
    setProducts(loadedProducts);
    setLoading(false);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, sortBy]);

  const categories = useMemo(() => getUniqueCategories(products), [products]);

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = filterProducts(products, debouncedSearchTerm, categoryFilter);
    return sortProducts(filtered, sortBy);
  }, [products, debouncedSearchTerm, categoryFilter, sortBy]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedProducts.slice(startIndex, endIndex);
  }, [filteredAndSortedProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);

  const analytics = useMemo(() => calculateAnalytics(products), [products]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning') => {
    const id = generateId();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(p => p.id !== id);
      setProducts(updatedProducts);
      saveProducts(updatedProducts);
      showToast('Product deleted successfully', 'success');
    }
  };

  const handleSubmitProduct = (productData: Omit<Product, 'id'>) => {
    if (editingProduct) {
      const updatedProducts = products.map(p =>
        p.id === editingProduct.id ? { ...productData, id: editingProduct.id } : p
      );
      setProducts(updatedProducts);
      saveProducts(updatedProducts);
      showToast('Product updated successfully', 'success');
    } else {
      const newProduct: Product = {
        ...productData,
        id: generateId()
      };
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      saveProducts(updatedProducts);
      showToast('Product added successfully', 'success');
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleCancelForm = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  if (loading) {
    return (
      <div className="app-container">
        <ThreeBackground />
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <ThreeBackground />

      <div className="app-content">
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">Product Management Dashboard</h1>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        <main className="main-content">
          <Analytics
            totalProducts={analytics.totalProducts}
            totalStock={analytics.totalStock}
            totalValue={analytics.totalValue}
            lowStockCount={analytics.lowStockCount}
          />

          <Toolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onAddProduct={handleAddProduct}
            categories={categories}
          />

          {viewMode === 'list' ? (
            <ListView
              products={paginatedProducts}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ) : (
            <CardView
              products={paginatedProducts}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredAndSortedProducts.length}
          />
        </main>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCancelForm}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <ProductForm
          onSubmit={handleSubmitProduct}
          onCancel={handleCancelForm}
          initialData={editingProduct || undefined}
          categories={categories}
        />
      </Modal>

      <div className="toast-container">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </div>
  );
}

export default App;
