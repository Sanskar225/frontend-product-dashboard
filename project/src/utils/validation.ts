export interface ValidationErrors {
  name?: string;
  price?: string;
  category?: string;
  stock?: string;
}

export interface ProductFormData {
  name: string;
  price: string;
  category: string;
  stock: string;
  description: string;
}

export const validateProduct = (formData: ProductFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!formData.name.trim()) {
    errors.name = 'Product name is required';
  } else if (formData.name.trim().length < 2) {
    errors.name = 'Product name must be at least 2 characters';
  }

  if (!formData.price) {
    errors.price = 'Price is required';
  } else {
    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      errors.price = 'Price must be a positive number';
    }
  }

  if (!formData.category.trim()) {
    errors.category = 'Category is required';
  }

  if (formData.stock && formData.stock.trim()) {
    const stockNum = parseInt(formData.stock);
    if (isNaN(stockNum) || stockNum < 0) {
      errors.stock = 'Stock must be a non-negative number';
    }
  }

  return errors;
};
