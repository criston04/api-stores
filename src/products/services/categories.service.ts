import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/categories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  findAll() {
    return this.categoryRepository.find();
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!category) {
      throw new HttpException(
        `Category #${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
    return category;
  }

  create(payload: CreateCategoryDto) {
    const category = this.categoryRepository.create(payload);
    return this.categoryRepository.save(category);
  }

  async update(id: number, payload: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) {
      throw new HttpException(
        `Category #${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    this.categoryRepository.merge(category, payload);
    return this.categoryRepository.save(category);
  }

  async delete(id: number): Promise<DeleteResult> {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) {
      throw new HttpException(
        `Category #${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.categoryRepository.delete(id);
  }
}
