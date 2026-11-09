import axios, { AxiosError, AxiosRequestConfig } from 'axios';

export interface CreateOrderDto {
  customerName: string;
  customerEmail: string;
  items: OrderItemDto[];
  totalAmount: number;
  status?: string;
}

export interface UpdateOrderDto {
  customerName?: string;
  customerEmail?: string;
  items?: OrderItemDto[];
  totalAmount?: number;
  status?: string;
}

export interface OrderItemDto {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderEntity {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItemDto[];
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

const API_BASE_URL = 'http://localhost:3000';

export class OrderService {
  private readonly axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiErrorResponse>) => {
        if (error.response) {
          const errorMessage = error.response.data?.message || 'Error en la solicitud';
          console.error(`[OrderService] Error ${error.response.status}: ${errorMessage}`);
          return Promise.reject(new Error(errorMessage));
        } else if (error.request) {
          console.error('[OrderService] No se recibió respuesta del servidor');
          return Promise.reject(new Error('No se pudo conectar con el servidor'));
        } else {
          console.error('[OrderService] Error al configurar la solicitud:', error.message);
          return Promise.reject(new Error('Error al procesar la solicitud'));
        }
      }
    );
  }

  async createOrder(orderData: CreateOrderDto): Promise<OrderEntity> {
    const config: AxiosRequestConfig<CreateOrderDto> = {
      method: 'POST',
      url: '/orders',
      data: orderData,
    };

    const response = await this.axiosInstance.request<OrderEntity>(config);
    return response.data;
  }

  async getOrder(orderId: string): Promise<OrderEntity> {
    if (!orderId || orderId.trim() === '') {
      throw new Error('El ID de la orden es requerido');
    }

    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `/orders/${encodeURIComponent(orderId)}`,
    };

    const response = await this.axiosInstance.request<OrderEntity>(config);
    return response.data;
  }

  async updateOrder(orderId: string, orderData: UpdateOrderDto): Promise<OrderEntity> {
    if (!orderId || orderId.trim() === '') {
      throw new Error('El ID de la orden es requerido');
    }

    const config: AxiosRequestConfig<UpdateOrderDto> = {
      method: 'PUT',
      url: `/orders/${encodeURIComponent(orderId)}`,
      data: orderData,
    };

    const response = await this.axiosInstance.request<OrderEntity>(config);
    return response.data;
  }

  async deleteOrder(orderId: string): Promise<void> {
    if (!orderId || orderId.trim() === '') {
      throw new Error('El ID de la orden es requerido');
    }

    const config: AxiosRequestConfig = {
      method: 'DELETE',
      url: `/orders/${encodeURIComponent(orderId)}`,
    };

    await this.axiosInstance.request(config);
  }

  async listOrders(): Promise<OrderEntity[]> {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: '/orders',
    };

    const response = await this.axiosInstance.request<OrderEntity[]>(config);
    return response.data;
  }
}

export const orderService = new OrderService();
export default orderService;