import { Module } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { OrderController } from './infrastructure/order.controller';
import { OrderService } from './application/order.service';
import { OrderRepository } from './domain/order.repository';
import { OrderRepositoryImpl } from './infrastructure/dynamodb/order.repository.impl';
import { AwsConfig } from './infrastructure/config/aws.config';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';

@Module({
  imports: [],
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: OrderRepository,
      useClass: OrderRepositoryImpl,
    },
    AwsConfig,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}