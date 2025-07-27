import { BadRequestException, Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { GroupBuysService } from './group-buys.service';
import { Request } from 'express';
import { CreateGroupBuyDto } from './dto/create-group-buy.dto';

@UseGuards(JwtGuard)
@Controller('group-buys')
export class GroupBuysController {
    constructor(private readonly groupBuysService: GroupBuysService) {}

    @Post('create')
    async createGroupBuy(@Req() req: Request, @Body() dto: CreateGroupBuyDto) {
        if(!req.user) {
            throw new BadRequestException('User not found on request.')
        }

        const supplierId = req.user.id;

        return this.groupBuysService.create(supplierId, dto);
    }

    @Get('mine')
    async getMyGroupBuys(@Req() req: Request) {
        if(!req.user) {
            throw new BadRequestException('User not found on request.')
        }

        const supplierId = req.user.id;

        return this.groupBuysService.findMine(supplierId);
    }

    @Get()
    findAll(@Req() req: Request) {
        if (!req.user || !req.user.area_name) {
            throw new BadRequestException(
                'User profile is missing area information.',
            );
        }

        const userArea = req.user.area_name;

        return this.groupBuysService.findAll(userArea)
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.groupBuysService.findOne(id)
    }
}
