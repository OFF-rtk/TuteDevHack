import { Module } from '@nestjs/common';
import { SuppliersController } from './suppliers.controller';
import { SuppliersService } from './suppliers.service';
import { SupabaseService } from 'src/supabase/supabase.service';

@Module({
  controllers: [SuppliersController],
  providers: [SuppliersService, SupabaseService],
  exports: [SuppliersService]
})
export class SuppliersModule {}
