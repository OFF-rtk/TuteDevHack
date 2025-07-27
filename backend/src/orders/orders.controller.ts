import { BadRequestException, Body, Controller, Get, InternalServerErrorException, Post, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { OrdersService, ParsedOrder } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PlaceOrderDto } from './dto/place-order.dto';
import { Request } from 'express';
import { OrderResponseDto } from './dto/order-response.dto';

@UseGuards(JwtGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('voice')
  async createFromVoice(
    @Req() req: Request,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<{ message: string; parsedOrder: ParsedOrder }> {
    if (!req.user) {
      throw new BadRequestException('User not found on request.');
    }
    const vendorId = req.user.id;
    const command = createOrderDto.command;

    return await this.ordersService.createFromVoice(vendorId, command);
  }

  @Post('place')
  async placeOrder(
    @Req() req: Request,
    @Body() placeOrderDto: PlaceOrderDto,
  ) {
    if(!req.user) {
        throw new BadRequestException('User not found on request.')
    }

    const vendorId = req.user.id
    const { group_buy_id, quantity } = placeOrderDto;

    if(!group_buy_id || quantity == null) {
        throw new BadRequestException('group_buy_id and quantity are required.');
    }
    return await this.ordersService.placeOrder(vendorId, group_buy_id, quantity);
  }

  @Get('view')
  async viewOrders(@Req() req: Request): Promise<{ orders: OrderResponseDto[] }> {
    if(!req.user || !req.user.id) {
      throw new BadRequestException('User not authenticated')
    }

    const vendorId = req.user.id;
    try {
      const orders = await this.ordersService.getOrdersByVendor(vendorId);
      return { orders }
    } catch(error) {
      throw new InternalServerErrorException(error.message || 'Failed to fetch orders');
    }
  }
}
