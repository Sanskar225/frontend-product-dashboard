export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock?: number;
  description?: string;
}

const STORAGE_KEY = 'product_dashboard_data';

export const loadProducts = (): Product[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return getDefaultProducts();

    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : getDefaultProducts();
  } catch (error) {
    console.error('Error loading products from localStorage:', error);
    return getDefaultProducts();
  }
};

export const saveProducts = (products: Product[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving products to localStorage:', error);
  }
};

const getDefaultProducts = (): Product[] => [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 79.99,
    category: 'Electronics',
    stock: 45,
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life'
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 199.99,
    category: 'Electronics',
    stock: 8,
    description: 'Fitness tracking smartwatch with heart rate monitor and GPS'
  },
  {
    id: '3',
    name: 'Laptop Stand',
    price: 34.99,
    category: 'Accessories',
    stock: 120,
    description: 'Ergonomic aluminum laptop stand with adjustable height'
  },
  {
    id: '4',
    name: 'Mechanical Keyboard',
    price: 129.99,
    category: 'Electronics',
    stock: 3,
    description: 'RGB mechanical gaming keyboard with cherry MX switches'
  },
  {
    id: '5',
    name: 'Desk Lamp',
    price: 42.50,
    category: 'Furniture',
    stock: 67,
    description: 'LED desk lamp with touch controls and adjustable brightness'
  },
  {
    id: '6',
    name: 'Office Chair',
    price: 299.99,
    category: 'Furniture',
    stock: 15,
    description: 'Ergonomic office chair with lumbar support and breathable mesh'
  },
  {
    id: '7',
    name: 'USB-C Cable',
    price: 12.99,
    category: 'Accessories',
    stock: 250,
    description: 'Durable braided USB-C cable with fast charging support'
  },
  {
    id: '8',
    name: 'Notebook Set',
    price: 18.99,
    category: 'Stationery',
    stock: 95,
    description: 'Premium hardcover notebook set with dotted pages'
  },
  {
    id: '9',
    name: 'Wireless Mouse',
    price: 29.99,
    category: 'Electronics',
    stock: 2,
    description: 'Ergonomic wireless mouse with precision tracking'
  },
  {
    id: '10',
    name: 'Monitor Stand',
    price: 54.99,
    category: 'Accessories',
    stock: 38,
    description: 'Dual monitor stand with cable management'
  }
];
