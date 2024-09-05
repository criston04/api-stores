import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CreateOrderItemDto,
  UpdateOrderItemDto,
} from '../dtos/order-items.dto';

import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(payload: CreateOrderItemDto) {
    const order = await this.orderRepository.findOneBy({ id: payload.orderId });
    const product = await this.productRepository.findOneBy({
      id: payload.productId,
    });

    const item = new OrderItem();
    item.order = order;
    item.product = product;
    item.quantity = payload.quantity;

    return this.orderItemRepository.save(item);
  }

  async update(id: number, changes: UpdateOrderItemDto) {
    const item = await this.orderItemRepository.findOneBy({ id });
    if (changes.orderId) {
      const order = await this.orderRepository.findOneBy({
        id: changes.orderId,
      });
      item.order = order;
    }
    if (changes.productId) {
      const product = await this.productRepository.findOneBy({
        id: changes.productId,
      });
      item.product = product;
    }
    this.orderItemRepository.merge(item, changes);
    return this.orderItemRepository.save(item);
  }

  async delete(id: number) {
    const order = await this.orderRepository.findOneBy({ id });

    if (!order) {
      throw new HttpException(
        `Order Item #${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
    return this.orderItemRepository.delete(id);
  }
}
