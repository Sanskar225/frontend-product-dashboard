import { useState, useEffect, useRef } from 'react';
import { Product } from '../utils/storage';
import { validateProduct, ValidationErrors, ProductFormData } from '../utils/validation';
import Button from './Button';

interface ProductFormProps {
  onSubmit: (product: Omit<Product, 'id'>) => void;
  onCancel: () => void;
  initialData?: Product;
  categories: string[];
}

const ProductForm = ({ onSubmit, onCancel, initialData, categories }: ProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || '',
    price: initialData?.price?.toString() || '',
    category: initialData?.category || '',
    stock: initialData?.stock?.toString() || '',
    description: initialData?.description || ''
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateProduct(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      category: formData.category.trim(),
      stock: formData.stock ? parseInt(formData.stock) : undefined,
      description: formData.description.trim() || undefined
    });
  };

  const availableCategories = categories.filter(c => c !== 'All');

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-group">
        <label htmlFor="name">
          Product Name <span className="required">*</span>
        </label>
        <input
          ref={nameInputRef}
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'input-error' : ''}
          placeholder="Enter product name"
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="price">
            Price <span className="required">*</span>
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={errors.price ? 'input-error' : ''}
            placeholder="0.00"
            step="0.01"
            min="0"
          />
          {errors.price && <span className="error-message">{errors.price}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="stock">Stock</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className={errors.stock ? 'input-error' : ''}
            placeholder="0"
            min="0"
          />
          {errors.stock && <span className="error-message">{errors.stock}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="category">
          Category <span className="required">*</span>
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={errors.category ? 'input-error' : ''}
        >
          <option value="">Select a category</option>
          {availableCategories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
          <option value="Other">Other</option>
        </select>
        {errors.category && <span className="error-message">{errors.category}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter product description"
          rows={3}
        />
      </div>

      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initialData ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
