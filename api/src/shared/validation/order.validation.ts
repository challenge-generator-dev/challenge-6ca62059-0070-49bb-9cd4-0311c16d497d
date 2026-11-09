import { OrderStatus, OrderItem } from '../../domain/order.entity';

export interface ValidationRule {
  field: string;
  validator: (value: any) => boolean;
  message: string;
}

export class OrderValidation {
  private static readonly MIN_ITEMS = 1;
  private static readonly MAX_ITEMS = 100;
  private static readonly MIN_TOTAL_AMOUNT = 0;
  private static readonly MAX_TOTAL_AMOUNT = 999999.99;

  static validateCustomerId(customerId: string): boolean {
    if (!customerId || typeof customerId !== 'string') {
      return false;
    }
    const customerIdPattern = /^CUST-[A-Z0-9]{6,20}$/;
    return customerIdPattern.test(customerId);
  }

  static validateItems(items: OrderItem[]): boolean {
    if (!Array.isArray(items) || items.length < this.MIN_ITEMS) {
      return false;
    }
    if (items.length > this.MAX_ITEMS) {
      return false;
    }
    return items.every(item => this.validateOrderItem(item));
  }

  private static validateOrderItem(item: OrderItem): boolean {
    const hasProductId = item.productId && typeof item.productId === 'string' && item.productId.length > 0;
    const hasQuantity = typeof item.quantity === 'number' && item.quantity > 0;
    const hasUnitPrice = typeof item.unitPrice === 'number' && item.unitPrice >= 0;
    return hasProductId && hasQuantity && hasUnitPrice;
  }

  static validateTotalAmount(amount: number): boolean {
    return typeof amount === 'number' &&
           amount >= this.MIN_TOTAL_AMOUNT &&
           amount <= this.MAX_TOTAL_AMOUNT;
  }

  static validateStatus(status: OrderStatus): boolean {
    const validStatuses = Object.values(OrderStatus);
    return validStatuses.includes(status);
  }

  static validateOrderForCreation(customerId: string, items: OrderItem[], totalAmount: number): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.validateCustomerId(customerId)) {
      errors.push('Invalid customerId format. Must match pattern CUST-[A-Z0-9]{6,20}');
    }

    if (!this.validateItems(items)) {
      errors.push(`Invalid items: must have between ${this.MIN_ITEMS} and ${this.MAX_ITEMS} valid items`);
    }

    if (!this.validateTotalAmount(totalAmount)) {
      errors.push(`Invalid totalAmount: must be between ${this.MIN_TOTAL_AMOUNT} and ${this.MAX_TOTAL_AMOUNT}`);
    }

    return { valid: errors.length === 0, errors };
  }

  static validateOrderForUpdate(customerId?: string, items?: OrderItem[], status?: OrderStatus, totalAmount?: number): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (customerId !== undefined && !this.validateCustomerId(customerId)) {
      errors.push('Invalid customerId format. Must match pattern CUST-[A-Z0-9]{6,20}');
    }

    if (items !== undefined && !this.validateItems(items)) {
      errors.push(`Invalid items: must have between ${this.MIN_ITEMS} and ${this.MAX_ITEMS} valid items`);
    }

    if (status !== undefined && !this.validateStatus(status)) {
      errors.push(`Invalid status: must be one of ${Object.values(OrderStatus).join(', ')}`);
    }

    if (totalAmount !== undefined && !this.validateTotalAmount(totalAmount)) {
      errors.push(`Invalid totalAmount: must be between ${this.MIN_TOTAL_AMOUNT} and ${this.MAX_TOTAL_AMOUNT}`);
    }

    return { valid: errors.length === 0, errors };
  }

  static sanitizeInput(input: string): string {
    if (typeof input !== 'string') return '';
    return input.trim().replace(/[<>"'&]/g, '');
  }

  static validateId(id: string): boolean {
    if (!id || typeof id !== 'string') return false;
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidPattern.test(id);
  }
}