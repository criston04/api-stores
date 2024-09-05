import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Order } from '../entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { CreateOrderDto, UpdateOrderDto } from '../dtos/orders.dto';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  findAll(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new HttpException(`Order #${id} not found.`, HttpStatus.NOT_FOUND);
    }
    return order;
  }

  async create(payload: CreateOrderDto): Promise<Order> {
    const order = new Order();
    if (payload.customerId) {
      const customer = await this.customerRepository.findOneBy({
        id: payload.customerId,
      });
      order.customer = customer;
    }
    return this.orderRepository.save(order);
  }

  async update(id: number, payload: UpdateOrderDto): Promise<Order> {
    const order = await this.orderRepository.findOneBy({ id });

    if (!order) {
      throw new HttpException(`Order #${id} not found.`, HttpStatus.NOT_FOUND);
    }

    if (payload.customerId) {
      const customer = await this.customerRepository.findOneBy({
        id: payload.customerId,
      });
      order.customer = customer;
    }

    return this.orderRepository.save(order);
  }

  async delete(id: number): Promise<DeleteResult> {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) {
      throw new HttpException(`Order #${id} not found.`, HttpStatus.NOT_FOUND);
    }

    return this.orderRepository.delete(id);
  }
}
