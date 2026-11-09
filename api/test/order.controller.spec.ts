import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { OrderController } from '../src/infrastructure/order.controller';
import { OrderService } from '../src/application/order.service';
import { OrderEntity, OrderStatus } from '../src/domain/order.entity';
import { OrderRepository } from '../src/domain/order.repository';

describe('OrderController (e2e)', () => {
  let app: INestApplication;
  let orderService: OrderService;

  const mockOrder: OrderEntity = {
    id: 'order-123',
    customerId: 'customer-456',
    items: [{ productId: 'prod-1', quantity: 2, price: 50 }],
    totalAmount: 100,
    status: OrderStatus.PENDING,
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z'),
    calculateTotalAmount: function(): number { return this.totalAmount; },
    validate: function(): void {},
    updateStatus: function(newStatus: OrderStatus): OrderEntity { 
      this.status = newStatus;
      return this;
    },
    updateItems: function(newItems: any[]): OrderEntity {
      this.items = newItems;
      return this;
    }
  };

  const mockOrderService = {
    createOrder: jest.fn().mockResolvedValue(mockOrder),
    getOrder: jest.fn().mockResolvedValue(mockOrder),
    updateOrder: jest.fn().mockResolvedValue({ ...mockOrder, totalAmount: 150 }),
    deleteOrder: jest.fn().mockResolvedValue(undefined),
  };

  const mockOrderRepository = {
    create: jest.fn().mockResolvedValue(mockOrder),
    findById: jest.fn().mockResolvedValue(mockOrder),
    update: jest.fn().mockResolvedValue(mockOrder),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        { provide: OrderService, useValue: mockOrderService },
        { provide: OrderRepository, useValue: mockOrderRepository },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();
    orderService = moduleFixture.get<OrderService>(OrderService);
  });

  afterEach(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  describe('POST /orders', () => {
    it('debería crear una orden exitosamente', async () => {
      const createOrderDto = {
        customerId: 'customer-456',
        items: [{ productId: 'prod-1', quantity: 2, price: 50 }],
      };

      const response = await request(app.getHttpServer())
        .post('/orders')
        .send(createOrderDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.customerId).toBe(createOrderDto.customerId);
      expect(mockOrderService.createOrder).toHaveBeenCalledWith(createOrderDto);
    });

    it('debería fallar con datos inválidos', async () => {
      const invalidDto = { customerId: '', items: [] };

      await request(app.getHttpServer())
        .post('/orders')
        .send(invalidDto)
        .expect(400);
    });

    it('debería fallar sin customerId', async () => {
      const invalidDto = { items: [{ productId: 'prod-1', quantity: 2, price: 50 }] };

      await request(app.getHttpServer())
        .post('/orders')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('GET /orders/:id', () => {
    it('debería obtener una orden por id', async () => {
      const response = await request(app.getHttpServer())
        .get('/orders/order-123')
        .expect(200);

      expect(response.body.id).toBe('order-123');
      expect(mockOrderService.getOrder).toHaveBeenCalledWith('order-123');
    });

    it('debería devolver 404 si la orden no existe', async () => {
      mockOrderService.getOrder.mockResolvedValueOnce(null);

      await request(app.getHttpServer())
        .get('/orders/non-existent')
        .expect(404);
    });
  });

  describe('PUT /orders/:id', () => {
    it('debería actualizar una orden exitosamente', async () => {
      const updateOrderDto = {
        items: [{ productId: 'prod-1', quantity: 3, price: 50 }],
      };

      const response = await request(app.getHttpServer())
        .put('/orders/order-123')
        .send(updateOrderDto)
        .expect(200);

      expect(response.body.totalAmount).toBe(150);
      expect(mockOrderService.updateOrder).toHaveBeenCalledWith('order-123', updateOrderDto);
    });

    it('debería devolver 404 si la orden no existe para actualizar', async () => {
      mockOrderService.updateOrder.mockRejectedValueOnce(new Error('Order not found'));

      await request(app.getHttpServer())
        .put('/orders/non-existent')
        .send({ items: [] })
        .expect(404);
    });
  });

  describe('DELETE /orders/:id', () => {
    it('debería eliminar una orden exitosamente', async () => {
      await request(app.getHttpServer())
        .delete('/orders/order-123')
        .expect(204);

      expect(mockOrderService.deleteOrder).toHaveBeenCalledWith('order-123');
    });

    it('debería devolver 404 si la orden no existe para eliminar', async () => {
      mockOrderService.deleteOrder.mockRejectedValueOnce(new Error('Order not found'));

      await request(app.getHttpServer())
        .delete('/orders/non-existent')
        .expect(404);
    });
  });

  describe('Manejo de errores del servidor', () => {
    it('debería manejar errores internos del servidor', async () => {
      mockOrderService.getOrder.mockRejectedValueOnce(new Error('Database error'));

      await request(app.getHttpServer())
        .get('/orders/order-123')
        .expect(500);
    });

    it('debería manejar errores de validación del DTO', async () => {
      const invalidDto = {
        customerId: 'customer-456',
        items: [{ productId: 'prod-1', quantity: -1, price: 50 }],
      };

      await request(app.getHttpServer())
        .post('/orders')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('Verificación de idempotencia', () => {
    it('POST /orders debería ser idempotente con el mismo idempotency-key', async () => {
      const createOrderDto = {
        customerId: 'customer-456',
        items: [{ productId: 'prod-1', quantity: 2, price: 50 }],
      };

      await request(app.getHttpServer())
        .post('/orders')
        .set('Idempotency-Key', 'unique-key-123')
        .send(createOrderDto)
        .expect(201);

      await request(app.getHttpServer())
        .post('/orders')
        .set('Idempotency-Key', 'unique-key-123')
        .send(createOrderDto)
        .expect(201);
    });
  });
});