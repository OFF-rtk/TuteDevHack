import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHealth() {
    return { 
      status: 'ok', 
      message: 'MandiNow Backend is running!',
      timestamp: new Date().toISOString(),
      service: 'MandiNow API'
    };
  }

  @Get('health')
  getHealthCheck() {
    return { 
      status: 'healthy', 
      service: 'MandiNow Backend API',
      timestamp: new Date().toISOString()
    };
  }

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
