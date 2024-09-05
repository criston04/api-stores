import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { CreateCustomerDto, UpdateCustomerDto } from '../dtos/customers.dto';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  findAll(): Promise<Customer[]> {
    return this.customerRepository.find();
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOneBy({ id });

    if (!customer) {
      throw new HttpException(
        `Customer #${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
    return customer;
  }

  create(payload: CreateCustomerDto): Promise<Customer> {
    const customer = this.customerRepository.create(payload);
    return this.customerRepository.save(customer);
  }

  async update(id: number, payload: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.customerRepository.findOneBy({ id });

    if (!customer) {
      throw new HttpException(
        `Customer #${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    this.customerRepository.merge(customer, payload);
    return this.customerRepository.save(customer);
  }

  async delete(id: number): Promise<DeleteResult> {
    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) {
      throw new HttpException(
        `Customer #${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.customerRepository.delete(id);
  }
}
