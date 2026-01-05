import { Product } from './storage';

export const LOW_STOCK_THRESHOLD = 10;

export const getUniqueCategories = (products: Product[]): string[] => {
  const categories = products.map(p => p.category);
  return ['All', ...Array.from(new Set(categories)).sort()];
};

export const filterProducts = (
  products: Product[],
  searchTerm: string,
  categoryFilter: string
): Product[] => {
  return products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
};

export const sortProducts = (
  products: Product[],
  sortBy: string
): Product[] => {
  const sorted = [...products];

  switch (sortBy) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'stock-asc':
      return sorted.sort((a, b) => (a.stock || 0) - (b.stock || 0));
    default:
      return sorted;
  }
};

export const calculateAnalytics = (products: Product[]) => {
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const totalValue = products.reduce((sum, p) => sum + p.price * (p.stock || 0), 0);
  const lowStockCount = products.filter(p => (p.stock || 0) < LOW_STOCK_THRESHOLD && (p.stock || 0) > 0).length;

  return {
    totalProducts,
    totalStock,
    totalValue,
    lowStockCount
  };
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
