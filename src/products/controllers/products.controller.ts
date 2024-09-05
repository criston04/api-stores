import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  Body,
  Put,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ParseIntPipe } from '@pipes/parse-int/parse-int.pipe';
import {
  CreateProductDto,
  FilterProductDto,
  UpdateProductDto,
} from '../dtos/products.dto';
import { Product } from '../entities/product.entity';
import { ProductsService } from '../services/products.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  getAll(@Query() params: FilterProductDto): Promise<Product[]> {
    return this.productsService.findAll(params);
  }

  @Get(':productId')
  @HttpCode(HttpStatus.ACCEPTED)
  getOne(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<Product> {
    return this.productsService.findOne(productId);
  }

  @Post()
  create(@Body() payload: CreateProductDto): Promise<Product> {
    return this.productsService.create(payload);
  }

  @Put(':id/categories/:categoryId')
  addCategoryToProduct(
    @Param('id', ParseIntPipe) id: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<Product> {
    return this.productsService.addCategoryToProduct(id, categoryId);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.productsService.delete(id);
  }

  @Delete(':id/categories/:categoryId')
  deleteCategoryByProduct(
    @Param('id', ParseIntPipe) id: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<Product> {
    console.log({ id, categoryId });
    return this.productsService.deleteCategoryByProduct(id, categoryId);
  }
}
