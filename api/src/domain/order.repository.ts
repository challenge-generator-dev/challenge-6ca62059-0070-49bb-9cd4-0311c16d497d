import { OrderEntity } from './order.entity';

export interface OrderRepository {
  create(order: OrderEntity): Promise<OrderEntity>;
  findById(id: string): Promise<OrderEntity | null>;
  update(id: string, order: OrderEntity): Promise<OrderEntity>;
  delete(id: string): Promise<void>;
}