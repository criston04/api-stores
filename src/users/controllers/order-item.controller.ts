import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { OrderItemService } from '../services/order-item.service';
import {
  CreateOrderItemDto,
  UpdateOrderItemDto,
} from '../dtos/order-items.dto';
import { OrderItem } from '../entities/order-item.entity';

@Controller('order-item')
export class OrderItemController {
  constructor(private orderItemService: OrderItemService) {}

  @Post()
  create(@Body() payload: CreateOrderItemDto): Promise<OrderItem> {
    return this.orderItemService.create(payload);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateOrderItemDto,
  ) {
    return this.orderItemService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.orderItemService.delete(id);
  }
}
