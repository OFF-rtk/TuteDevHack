import { Controller, UseGuards, Get, Patch, Post, Param, Body, Req, BadRequestException } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { ProductsService } from './products.service';
import { Request } from 'express';
import { CreateProductDto } from './dto/create-product.dto';

@UseGuards(JwtGuard)
@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductsService) {}

    @Get()
    findAll() {
        return this.productService.findAll()
    }

    @Post('create')
    async createProduct(@Req() req: Request, @Body() dto: CreateProductDto) {
        if(!req.user) {
            throw new BadRequestException('User not found on request.')
        }
        
        return this.productService.create(req.user.id, dto);
    }

    @Patch(':id')
    async updateProduct(
        @Req() req: Request,
        @Param('id') id: string,
        @Body() dto: Partial<CreateProductDto>
    ) {
        if(!req.user) {
            throw new BadRequestException('User not found on request.')
        }

        return this.productService.update(id, req.user.id, dto);
    }

    @Get('supplier')
    async listMyProducts(@Req() req: Request) {
        if(!req.user) {
            throw new BadRequestException('User not found on request.')
        }
        
        return this.productService.findMine(req.user.id);
    }

    @Get('available')
    @UseGuards(JwtGuard)
    async getAvailableProducts(@Req() req: Request) {
        if(!req.user) {
            throw new BadRequestException('User not found on request.')
        }

        const vendorId = req.user.id
        return this.productService.findAvailableInArea(vendorId)
    }
}
