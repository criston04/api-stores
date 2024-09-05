import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Brand } from '../entities/brand.entity';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brands.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand) private brandRepository: Repository<Brand>,
  ) {}

  findAll() {
    return this.brandRepository.find();
  }

  async findOne(id: number) {
    const brand = await this.brandRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!brand) {
      throw new HttpException(`Brand #${id} not found.`, HttpStatus.NOT_FOUND);
    }
    return brand;
  }

  create(payload: CreateBrandDto) {
    const brand = this.brandRepository.create(payload);
    return this.brandRepository.save(brand);
  }

  async update(id: number, payload: UpdateBrandDto) {
    const brand = await this.brandRepository.findOneBy({ id });

    if (!brand) {
      throw new HttpException(`Brand #${id} not found.`, HttpStatus.NOT_FOUND);
    }

    this.brandRepository.merge(brand, payload);
    return this.brandRepository.save(brand);
  }

  async delete(id: number): Promise<DeleteResult> {
    const brand = await this.brandRepository.findOneBy({ id });

    if (!brand) {
      throw new HttpException(`Brand #${id} not found.`, HttpStatus.NOT_FOUND);
    }

    return this.brandRepository.delete(id);
  }
}
