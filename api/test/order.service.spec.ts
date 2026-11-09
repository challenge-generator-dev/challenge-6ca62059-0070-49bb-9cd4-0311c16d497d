import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../src/application/order.service';
import { OrderRepository } from '../src/domain/order.repository';
import { OrderEntity, OrderStatus, OrderItem } from '../src/domain/order.entity';
import { CreateOrderDto } from '../src/shared/dto/create-order.dto';
import { UpdateOrderDto } from '../src/shared/dto/update-order.dto';

describe('OrderService', () => {
  let service: OrderService;
  let repository: OrderRepository;

  const mockOrderEntity = {
    id: 'order-123',
    customerId: 'customer-456',
    items: [{ productId: 'prod-1', quantity: 2, price: 50 }] as OrderItem[],
    totalAmount: 100,
    status: OrderStatus.PENDING,
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z'),
    calculateTotalAmount: function(): number { 
      return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    validate: function(): void { 
      if (!this.customerId || this.items.length === 0) {
        throw new Error('Invalid order');
      }
    },
    updateStatus: function(newStatus: OrderStatus): OrderEntity {
      this.status = newStatus;
      this.updatedAt = new Date();
      return this;
    },
    updateItems: function(newItems: OrderItem[]): OrderEntity {
      this.items = newItems;
      this.totalAmount = this.calculateTotalAmount();
      this.updatedAt = new Date();
      return this;
    }
  };

  const mockRepository = {
    create: jest.fn().mockImplementation((order: OrderEntity) => Promise.resolve(order)),
    findById: jest.fn().mockImplementation((id: string) => {
      if (id === 'order-123') return Promise.resolve(mockOrderEntity as OrderEntity);
      return Promise.resolve(null);
    }),
    update: jest.fn().mockImplementation((id: string, order: OrderEntity) => Promise.resolve(order)),
    delete: jest.fn().mockImplementation((id: string) => Promise.resolve()),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: OrderRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    repository = module.get<OrderRepository>(OrderRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('debería crear una orden exitosamente', async () => {
      const createOrderDto: CreateOrderDto = {
        customerId: 'customer-456',
        items: [{ productId: 'prod-1', quantity: 2, price: 50 }],
      };

      const result = await service.createOrder(createOrderDto);

      expect(result).toBeDefined();
      expect(result.customerId).toBe(createOrderDto.customerId);
      expect(repository.create).toHaveBeenCalled();
    });

    it('debería calcular el monto total correctamente', async () => {
      const createOrderDto: CreateOrderDto = {
        customerId: 'customer-456',
        items: [
          { productId: 'prod-1', quantity: 2, price: 50 },
          { productId: 'prod-2', quantity: 1, price: 75 },
        ],
      };

      const result = await service.createOrder(createOrderDto);

      expect(result.totalAmount).toBe(175);
    });

    it('debería lanzar error si los items están vacíos', async () => {
      const createOrderDto: CreateOrderDto = {
        customerId: 'customer-456',
        items: [],
      };

      await expect(service.createOrder(createOrderDto)).rejects.toThrow('Invalid order');
    });

    it('debería asignar estado PENDING por defecto', async () => {
      const createOrderDto: CreateOrderDto = {
        customerId: 'customer-456',
        items: [{ productId: 'prod-1', quantity: 1, price: 100 }],
      };

      const result = await service.createOrder(createOrderDto);

      expect(result.status).toBe(OrderStatus.PENDING);
    });
  });

  describe('getOrder', () => {
    it('debería obtener una orden por id', async () => {
      const result = await service.getOrder('order-123');

      expect(result).toBeDefined();
      expect(result?.id).toBe('order-123');
      expect(repository.findById).toHaveBeenCalledWith('order-123');
    });

    it('debería devolver null si la orden no existe', async () => {
      const result = await service.getOrder('non-existent');

      expect(result).toBeNull();
      expect(repository.findById).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('updateOrder', () => {
    it('debería actualizar una orden exitosamente', async () => {
      const updateOrderDto: UpdateOrderDto = {
        items: [{ productId: 'prod-1', quantity: 5, price: 50 }],
      };

      const result = await service.updateOrder('order-123', updateOrderDto);

      expect(result).toBeDefined();
      expect(repository.update).toHaveBeenCalledWith('order-123', expect.any(Object));
    });

    it('debería lanzar error si la orden no existe', async () => {
      mockRepository.update.mockRejectedValueOnce(new Error('Order not found'));
      const updateOrderDto: UpdateOrderDto = { items: [] };

      await expect(service.updateOrder('non-existent', updateOrderDto)).rejects.toThrow('Order not found');
    });

    it('debería actualizar solo los campos proporcionados', async () => {
      const updateOrderDto: UpdateOrderDto = {
        status: OrderStatus.COMPLETED,
      };

      const result = await service.updateOrder('order-123', updateOrderDto);

      expect(result.status).toBe(OrderStatus.COMPLETED);
    });
  });

  describe('deleteOrder', () => {
    it('debería eliminar una orden exitosamente', async () => {
      await expect(service.deleteOrder('order-123')).resolves.not.toThrow();
      expect(repository.delete).toHaveBeenCalledWith('order-123');
    });

    it('debería lanzar error si la orden no existe', async () => {
      mockRepository.delete.mockRejectedValueOnce(new Error('Order not found'));

      await expect(service.deleteOrder('non-existent')).rejects.toThrow('Order not found');
    });
  });

  describe('Cálculos de dominio', () => {
    it('debería recalcular totalAmount al actualizar items', async () => {
      const createOrderDto: CreateOrderDto = {
        customerId: 'customer-456',
        items: [{ productId: 'prod-1', quantity: 1, price: 100 }],
      };

      const order = await service.createOrder(createOrderDto);
      expect(order.totalAmount).toBe(100);

      const updateOrderDto: UpdateOrderDto = {
        items: [
          { productId: 'prod-1', quantity: 2, price: 100 },
          { productId: 'prod-2', quantity: 1, price: 50 },
        ],
      };

      const updatedOrder = await service.updateOrder(order.id, updateOrderDto);
      expect(updatedOrder.totalAmount).toBe(250);
    });

    it('debería validar que quantity sea positivo', async () => {
      const createOrderDto: CreateOrderDto = {
        customerId: 'customer-456',
        items: [{ productId: 'prod-1', quantity: 0, price: 50 }],
      };

      await expect(service.createOrder(createOrderDto)).rejects.toThrow();
    });
  });

  describe('Transiciones de estado', () => {
    it('debería permitir transición de PENDING a COMPLETED', async () => {
      const updateOrderDto: UpdateOrderDto = {
        status: OrderStatus.COMPLETED,
      };

      const result = await service.updateOrder('order-123', updateOrderDto);

      expect(result.status).toBe(OrderStatus.COMPLETED);
    });

    it('debería permitir transición de PENDING a CANCELLED', async () => {
      const updateOrderDto: UpdateOrderDto = {
        status: OrderStatus.CANCELLED,
      };

      const result = await service.updateOrder('order-123', updateOrderDto);

      expect(result.status).toBe(OrderStatus.CANCELLED);
    });

    it('no debería permitir transición desde COMPLETED', async () => {
      const order = await service.getOrder('order-123');
      if (order) {
        order.status = OrderStatus.COMPLETED;
      }

      const updateOrderDto: UpdateOrderDto = {
        status: OrderStatus.PENDING,
      };

      await expect(service.updateOrder('order-123', updateOrderDto)).rejects.toThrow();
    });
  });
});