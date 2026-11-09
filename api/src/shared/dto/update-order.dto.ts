import { IsString, IsOptional, IsArray, ValidateNested, IsNumber, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../../domain/order.entity';

export class UpdateOrderItemDto {
  @IsString()
  @IsOptional()
  readonly productId?: string;

  @IsString()
  @IsOptional()
  readonly productName?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  readonly quantity?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly unitPrice?: number;
}

export class UpdateOrderDto {
  @IsString()
  @IsOptional()
  readonly customerId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderItemDto)
  @IsOptional()
  readonly items?: UpdateOrderItemDto[];

  @IsEnum(OrderStatus)
  @IsOptional()
  readonly status?: OrderStatus;

  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly totalAmount?: number;

  validate(): void {
    if (!this.customerId && !this.items && !this.status && this.totalAmount === undefined) {
      throw new Error('At least one field must be provided for update');
    }
    if (this.items && this.items.length === 0) {
      throw new Error('Items array cannot be empty');
    }
  }
}