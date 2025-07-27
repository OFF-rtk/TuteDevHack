import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [SupabaseModule, ProductsModule],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
