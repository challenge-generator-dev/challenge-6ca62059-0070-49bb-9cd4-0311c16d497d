import { IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItem } from '../../domain/order.entity';

export class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  price: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  validate(): void {
    if (!this.items || this.items.length === 0) {
      throw new Error('Order must have at least one item');
    }
    const totalAmount = this.items.reduce((total, item) => total + item.price * item.quantity, 0);
    if (totalAmount <= 0) {
      throw new Error('Total amount must be greater than zero');
    }
  }
}