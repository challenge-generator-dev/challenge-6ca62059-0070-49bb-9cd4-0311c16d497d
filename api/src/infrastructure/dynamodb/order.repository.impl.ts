import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { OrderRepository } from '../../domain/order.repository';
import { OrderEntity, OrderItem, OrderStatus } from '../../domain/order.entity';
import {
  configureDynamoDB,
  getDynamoDBTableName,
} from '../config/aws.config';

@Injectable()
export class OrderRepositoryImpl implements OrderRepository {
  private readonly logger = new Logger(OrderRepositoryImpl.name);
  private readonly docClient: AWS.DynamoDB.DocumentClient;
  private readonly tableName: string;

  constructor() {
    this.docClient = configureDynamoDB();
    this.tableName = getDynamoDBTableName();
  }

  async create(order: OrderEntity): Promise<OrderEntity> {
    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: this.tableName,
      Item: this.toDynamoItem(order),
    };

    try {
      await this.docClient.put(params).promise();
      this.logger.log(`Orden ${order.id} creada exitosamente en DynamoDB`);
      return order;
    } catch (error) {
      this.logger.error(
        `Error al crear orden ${order.id} en DynamoDB: ${error.message}`,
      );
      throw error;
    }
  }

  async findById(id: string): Promise<OrderEntity | null> {
    const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
      TableName: this.tableName,
      Key: { id },
    };

    try {
      const result = await this.docClient.get(params).promise();

      if (!result.Item) {
        this.logger.warn(`Orden con ID ${id} no encontrada en DynamoDB`);
        return null;
      }

      return this.fromDynamoItem(result.Item);
    } catch (error) {
      this.logger.error(
        `Error al buscar orden ${id} en DynamoDB: ${error.message}`,
      );
      throw error;
    }
  }

  async update(id: string, order: OrderEntity): Promise<OrderEntity> {
    const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: this.tableName,
      Key: { id },
      UpdateExpression:
        'SET customerId = :customerId, items = :items, totalAmount = :totalAmount, #status = :status, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':customerId': order.customerId,
        ':items': this.itemsToDynamo(order.items),
        ':totalAmount': order.totalAmount,
        ':status': order.status,
        ':updatedAt': order.updatedAt.toISOString(),
      },
      ReturnValues: 'ALL_NEW',
    };

    try {
      const result = await this.docClient.update(params).promise();
      this.logger.log(`Orden ${id} actualizada exitosamente en DynamoDB`);
      return this.fromDynamoItem(result.Attributes);
    } catch (error) {
      this.logger.error(
        `Error al actualizar orden ${id} en DynamoDB: ${error.message}`,
      );
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
      TableName: this.tableName,
      Key: { id },
    };

    try {
      await this.docClient.delete(params).promise();
      this.logger.log(`Orden ${id} eliminada exitosamente de DynamoDB`);
    } catch (error) {
      this.logger.error(
        `Error al eliminar orden ${id} en DynamoDB: ${error.message}`,
      );
      throw error;
    }
  }

  private toDynamoItem(order: OrderEntity): Record<string, any> {
    return {
      id: order.id,
      customerId: order.customerId,
      items: this.itemsToDynamo(order.items),
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }

  private fromDynamoItem(item: Record<string, any>): OrderEntity {
    const entity = new OrderEntity(
      item.id,
      item.customerId,
      this.itemsFromDynamo(item.items),
    );
    entity.updateStatus(item.status as OrderStatus);
    return entity;
  }

  private itemsToDynamo(items: OrderItem[]): Record<string, any>[] {
    return items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
    }));
  }

  private itemsFromDynamo(items: Record<string, any>[]): OrderItem[] {
    return items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
    }));
  }
}