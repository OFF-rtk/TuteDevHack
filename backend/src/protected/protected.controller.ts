import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt/jwt.guard'; // adjust path if needed
import { Request } from 'express';

@Controller('protected')
export class ProtectedController {
  @UseGuards(JwtGuard)
  @Get()
  getProtected(@Req() req: Request) {
    return {
      message: 'You have accessed a protected route',
      user: req.user,
    };
  }
}
