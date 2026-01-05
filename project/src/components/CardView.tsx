import { Edit2, Trash2, AlertCircle, Package as PackageIcon } from 'lucide-react';
import { Product } from '../utils/storage';
import { LOW_STOCK_THRESHOLD } from '../utils/helpers';
import Badge from './Badge';
import Button from './Button';

interface CardViewProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const CardView = ({ products, onEdit, onDelete }: CardViewProps) => {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <PackageIcon size={64} />
        <h3>No products found</h3>
        <p>Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="cards-grid">
      {products.map(product => {
        const isLowStock = (product.stock || 0) < LOW_STOCK_THRESHOLD && (product.stock || 0) > 0;
        const isOutOfStock = (product.stock || 0) === 0;

        return (
          <div key={product.id} className="product-card">
            <div className="product-card-header">
              <h3 className="product-card-title">{product.name}</h3>
              <span className="category-badge">{product.category}</span>
            </div>

            <div className="product-card-body">
              <div className="product-price-large">
                ${product.price.toFixed(2)}
              </div>

              <div className="product-stock-info">
                <span className="stock-label">Stock:</span>
                <div className="stock-value-container">
                  <span className="stock-value">
                    {product.stock !== undefined ? product.stock : 'N/A'}
                  </span>
                  {isLowStock && (
                    <Badge variant="warning" icon={<AlertCircle size={14} />}>
                      Low Stock
                    </Badge>
                  )}
                  {isOutOfStock && (
                    <Badge variant="danger">
                      Out of Stock
                    </Badge>
                  )}
                </div>
              </div>

              {product.description && (
                <p className="product-card-description">{product.description}</p>
              )}
            </div>

            <div className="product-card-actions">
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
          </div>
        );
      })}
    </div>
  );
};

export default CardView;
