import { Edit2, Trash2, AlertCircle } from 'lucide-react';
import { Product } from '../utils/storage';
import { LOW_STOCK_THRESHOLD } from '../utils/helpers';
import Badge from './Badge';
import Button from './Button';

interface ListViewProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ListView = ({ products, onEdit, onDelete }: ListViewProps) => {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <Package size={64} />
        <h3>No products found</h3>
        <p>Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="products-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => {
            const isLowStock = (product.stock || 0) < LOW_STOCK_THRESHOLD && (product.stock || 0) > 0;
            const isOutOfStock = (product.stock || 0) === 0;

            return (
              <tr key={product.id}>
                <td className="product-name">{product.name}</td>
                <td>
                  <span className="category-badge">{product.category}</span>
                </td>
                <td className="product-price">${product.price.toFixed(2)}</td>
                <td>
                  <div className="stock-cell">
                    {product.stock !== undefined ? product.stock : 'N/A'}
                    {isLowStock && (
                      <Badge variant="warning" icon={<AlertCircle size={14} />}>
                        Low
                      </Badge>
                    )}
                    {isOutOfStock && (
                      <Badge variant="danger">
                        Out
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="product-description">
                  {product.description || '—'}
                </td>
                <td>
                  <div className="action-buttons">
                    <Button
                      variant="ghost"
                      onClick={() => onEdit(product)}
                      icon={<Edit2 size={16} />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => onDelete(product.id)}
                      icon={<Trash2 size={16} />}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const Package = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16.5 9.4l-9-5.19" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

export default ListView;
