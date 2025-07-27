import { BadRequestException, Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { SuppliersService } from './suppliers.service';
import { Request } from 'express';

@UseGuards(JwtGuard)
@Controller('suppliers')
export class SuppliersController {
    constructor(private readonly suppliersService: SuppliersService) {}

    @Get('dashboard/analytics')
    async  getDashboardAnalytics(@Req() req: Request) {
        if(!req.user) {
            throw new BadRequestException('User not found on request.')
        }

        const supplierId = req.user.id;
        return await this.suppliersService.getDashboardAnalytics(supplierId)
    }
}
