import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Inject,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OrderService } from '../application/order.service';
import { OrderEntity } from '../domain/order.entity';
import { CreateOrderDto } from '../shared/dto/create-order.dto';
import { UpdateOrderDto } from '../shared/dto/update-order.dto';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(
    @Inject(OrderService)
    private readonly orderService: OrderService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva orden' })
  @ApiResponse({
    status: 201,
    description: 'Orden creada exitosamente',
    type: OrderEntity,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    createOrderDto.validate();
    return this.orderService.createOrder(createOrderDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una orden por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la orden' })
  @ApiResponse({
    status: 200,
    description: 'Orden encontrada',
    type: OrderEntity,
  })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  async getOrder(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<OrderEntity | null> {
    return this.orderService.getOrder(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una orden existente' })
  @ApiParam({ name: 'id', description: 'UUID de la orden' })
  @ApiResponse({
    status: 200,
    description: 'Orden actualizada exitosamente',
    type: OrderEntity,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  async updateOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderEntity> {
    updateOrderDto.validate();
    return this.orderService.updateOrder(id, updateOrderDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una orden' })
  @ApiParam({ name: 'id', description: 'UUID de la orden' })
  @ApiResponse({ status: 204, description: 'Orden eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  async deleteOrder(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.orderService.deleteOrder(id);
  }
}