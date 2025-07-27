import { Module } from '@nestjs/common';
import { GroupBuysController } from './group-buys.controller';
import { GroupBuysService } from './group-buys.service';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [GroupBuysController],
  providers: [GroupBuysService],
})
export class GroupBuysModule {}
