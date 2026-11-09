import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { OrderRepository } from '../domain/order.repository';
import { OrderEntity, OrderStatus } from '../domain/order.entity';
import { CreateOrderDto } from '../shared/dto/create-order.dto';
import { UpdateOrderDto } from '../shared/dto/update-order.dto';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(private readonly orderRepository: OrderRepository) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    this.logger.log(`Creating order for customer: ${createOrderDto.customerId}`);

    try {
      createOrderDto.validate();

      const order = new OrderEntity(
        this.generateId(),
        createOrderDto.customerId,
        createOrderDto.items,
        0,
        OrderStatus.PENDING,
        new Date(),
        new Date(),
      );

      order.calculateTotalAmount();
      order.validate();

      const createdOrder = await this.orderRepository.create(order);
      this.logger.log(`Order created successfully with ID: ${createdOrder.id}`);

      return createdOrder;
    } catch (error) {
      this.logger.error(`Failed to create order: ${error.message}`, error.stack);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to create order');
    }
  }

  async getOrder(id: string): Promise<OrderEntity> {
    this.logger.log(`Fetching order with ID: ${id}`);

    if (!id || id.trim() === '') {
      throw new BadRequestException('Order ID is required');
    }

    try {
      const order = await this.orderRepository.findById(id);

      if (!order) {
        this.logger.warn(`Order not found with ID: ${id}`);
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      this.logger.log(`Order fetched successfully: ${id}`);
      return order;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      this.logger.error(`Failed to fetch order: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch order');
    }
  }

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto): Promise<OrderEntity> {
    this.logger.log(`Updating order with ID: ${id}`);

    if (!id || id.trim() === '') {
      throw new BadRequestException('Order ID is required');
    }

    try {
      const existingOrder = await this.orderRepository.findById(id);

      if (!existingOrder) {
        this.logger.warn(`Order not found for update with ID: ${id}`);
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      let updatedOrder = existingOrder;

      if (updateOrderDto.items && updateOrderDto.items.length > 0) {
        updatedOrder = updatedOrder.updateItems(updateOrderDto.items);
      }

      if (updateOrderDto.status) {
        const newStatus = updateOrderDto.status as OrderStatus;
        this.validateStatusTransition(existingOrder.status, newStatus);
        updatedOrder = updatedOrder.updateStatus(newStatus);
      }

      const result = await this.orderRepository.update(id, updatedOrder);
      this.logger.log(`Order updated successfully: ${id}`);

      return result;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      this.logger.error(`Failed to update order: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update order');
    }
  }

  async deleteOrder(id: string): Promise<void> {
    this.logger.log(`Deleting order with ID: ${id}`);

    if (!id || id.trim() === '') {
      throw new BadRequestException('Order ID is required');
    }

    try {
      const existingOrder = await this.orderRepository.findById(id);

      if (!existingOrder) {
        this.logger.warn(`Order not found for deletion with ID: ${id}`);
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      if (existingOrder.status === OrderStatus.PROCESSING) {
        throw new BadRequestException('Cannot delete an order that is currently being processed');
      }

      await this.orderRepository.delete(id);
      this.logger.log(`Order deleted successfully: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      this.logger.error(`Failed to delete order: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to delete order');
    }
  }

  private generateId(): string {
    return `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }

  private validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): void {
    const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    const allowed = allowedTransitions[currentStatus] || [];

    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }
}