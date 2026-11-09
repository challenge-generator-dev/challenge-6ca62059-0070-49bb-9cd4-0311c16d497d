import { v4 as uuidv4 } from 'uuid';

export class OrderEntity {
  readonly id: string;
  readonly customerId: string;
  readonly items: OrderItem[];
  readonly totalAmount: number;
  readonly status: OrderStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(
    customerId: string,
    items: OrderItem[],
    id?: string,
    status?: OrderStatus,
    createdAt?: Date,
    updatedAt?: Date,
    totalAmount?: number,
  ) {
    this.id = id || uuidv4();
    this.customerId = customerId;
    this.items = items;
    this.totalAmount = totalAmount || this.calculateTotalAmount();
    this.status = status || OrderStatus.PENDING;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    this.validate();
  }

  private calculateTotalAmount(): number {
    return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  private validate(): void {
    if (!this.customerId || this.customerId.trim().length === 0) {
      throw new Error('Customer ID is required');
    }
    if (!this.items || this.items.length === 0) {
      throw new Error('Order must have at least one item');
    }
    if (this.totalAmount <= 0) {
      throw new Error('Total amount must be greater than zero');
    }
  }

  updateStatus(newStatus: OrderStatus): OrderEntity {
    return new OrderEntity(
      this.customerId,
      this.items,
      this.id,
      newStatus,
      this.createdAt,
      new Date(),
      this.totalAmount,
    );
  }

  updateItems(newItems: OrderItem[]): OrderEntity {
    return new OrderEntity(
      this.customerId,
      newItems,
      this.id,
      this.status,
      this.createdAt,
      new Date(),
    );
  }
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}