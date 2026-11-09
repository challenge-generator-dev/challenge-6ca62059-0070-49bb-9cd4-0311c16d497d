export interface ValidationRule<T> {
  validate: (value: T) => boolean;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface OrderFormData {
  customerName: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
  totalAmount: number;
  status: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 100;
const MIN_QUANTITY = 1;
const MIN_PRICE = 0.01;

export const validationRules = {
  customerName: [
    {
      validate: (value: string) => value && value.trim().length > 0,
      message: 'El nombre del cliente es requerido',
    },
    {
      validate: (value: string) => value && value.trim().length >= NAME_MIN_LENGTH,
      message: `El nombre debe tener al menos ${NAME_MIN_LENGTH} caracteres`,
    },
    {
      validate: (value: string) => value && value.trim().length <= NAME_MAX_LENGTH,
      message: `El nombre no puede exceder ${NAME_MAX_LENGTH} caracteres`,
    },
  ],
  customerEmail: [
    {
      validate: (value: string) => value && value.trim().length > 0,
      message: 'El correo electrónico es requerido',
    },
    {
      validate: (value: string) => EMAIL_REGEX.test(value),
      message: 'Por favor ingrese un correo electrónico válido',
    },
  ],
  items: [
    {
      validate: (value: unknown[]) => value && value.length > 0,
      message: 'Debe agregar al menos un producto a la orden',
    },
  ],
  itemQuantity: [
    {
      validate: (value: number) => value >= MIN_QUANTITY,
      message: `La cantidad debe ser al menos ${MIN_QUANTITY}`,
    },
  ],
  itemUnitPrice: [
    {
      validate: (value: number) => value >= MIN_PRICE,
      message: `El precio debe ser mayor a ${MIN_PRICE}`,
    },
  ],
  totalAmount: [
    {
      validate: (value: number) => value > 0,
      message: 'El monto total debe ser mayor a 0',
    },
  ],
  status: [
    {
      validate: (value: string) => value && value.trim().length > 0,
      message: 'El estado de la orden es requerido',
    },
    {
      validate: (value: string) => ['pending', 'processing', 'completed', 'cancelled'].includes(value.toLowerCase()),
      message: 'El estado debe ser: pending, processing, completed o cancelled',
    },
  ],
};

export function validateField<T>(fieldName: string, value: T): string | null {
  const rules = validationRules[fieldName as keyof typeof validationRules] as ValidationRule<T>[] | undefined;
  
  if (!rules) {
    return null;
  }

  for (const rule of rules) {
    if (!rule.validate(value)) {
      return rule.message;
    }
  }

  return null;
}

export function validateOrderForm(data: OrderFormData): ValidationResult {
  const errors: Record<string, string> = {};

  const nameError = validateField('customerName', data.customerName);
  if (nameError) errors.customerName = nameError;

  const emailError = validateField('customerEmail', data.customerEmail);
  if (emailError) errors.customerEmail = emailError;

  const itemsError = validateField('items', data.items);
  if (itemsError) errors.items = itemsError;

  const totalError = validateField('totalAmount', data.totalAmount);
  if (totalError) errors.totalAmount = totalError;

  const statusError = validateField('status', data.status);
  if (statusError) errors.status = statusError;

  if (data.items && data.items.length > 0) {
    data.items.forEach((item, index) => {
      const quantityError = validateField('itemQuantity', item.quantity);
      if (quantityError) errors[`items[${index}].quantity`] = quantityError;

      const priceError = validateField('itemUnitPrice', item.unitPrice);
      if (priceError) errors[`items[${index}].unitPrice`] = priceError;

      if (!item.productId || item.productId.trim() === '') {
        errors[`items[${index}].productId`] = 'El ID del producto es requerido';
      }

      if (!item.productName || item.productName.trim() === '') {
        errors[`items[${index}].productName`] = 'El nombre del producto es requerido';
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateItemQuantity(quantity: number): string | null {
  return validateField('itemQuantity', quantity);
}

export function validateItemPrice(price: number): string | null {
  return validateField('itemUnitPrice', price);
}

export function validateCustomerName(name: string): string | null {
  return validateField('customerName', name);
}

export function validateCustomerEmail(email: string): string | null {
  return validateField('customerEmail', email);
}

export function validateStatus(status: string): string | null {
  return validateField('status', status);
}

export function calculateTotalAmount(items: Array<{ quantity: number; unitPrice: number }>): number {
  if (!items || items.length === 0) return 0;
  
  return items.reduce((total, item) => {
    const quantity = item.quantity ?? 0;
    const unitPrice = item.unitPrice ?? 0;
    return total + (quantity * unitPrice);
  }, 0);
}

export function sanitizeOrderInput(data: Partial<OrderFormData>): OrderFormData {
  return {
    customerName: data.customerName?.trim() || '',
    customerEmail: data.customerEmail?.trim().toLowerCase() || '',
    items: data.items?.map((item) => ({
      productId: item.productId?.trim() || '',
      productName: item.productName?.trim() || '',
      quantity: Math.max(MIN_QUANTITY, item.quantity || MIN_QUANTITY),
      unitPrice: Math.max(MIN_PRICE, item.unitPrice || MIN_PRICE),
    })) || [],
    totalAmount: data.totalAmount || 0,
    status: data.status?.trim().toLowerCase() || 'pending',
  };
}

export function validateOrder(data: OrderFormData): ValidationResult {
  const errors: Record<string, string> = {};

  const nameError = validateCustomerName(data.customerName);
  if (nameError) errors.customerName = nameError;

  const emailError = validateCustomerEmail(data.customerEmail);
  if (emailError) errors.customerEmail = emailError;

  if (!data.items || data.items.length === 0) {
    errors.items = 'Debe agregar al menos un producto a la orden';
  } else {
    data.items.forEach((item, index) => {
      const quantityError = validateItemQuantity(item.quantity);
      if (quantityError) errors[`items[${index}].quantity`] = quantityError;

      const priceError = validateItemPrice(item.unitPrice);
      if (priceError) errors[`items[${index}].unitPrice`] = priceError;

      if (!item.productId || item.productId.trim() === '') {
        errors[`items[${index}].productId`] = 'El ID del producto es requerido';
      }

      if (!item.productName || item.productName.trim() === '') {
        errors[`items[${index}].productName`] = 'El nombre del producto es requerido';
      }
    });
  }

  if (data.totalAmount <= 0) {
    errors.totalAmount = 'El monto total debe ser mayor a 0';
  }

  const statusError = validateStatus(data.status);
  if (statusError) errors.status = statusError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}