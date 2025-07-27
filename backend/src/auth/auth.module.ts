import { Global, Module } from '@nestjs/common';
import { JwtGuard } from './jwt/jwt.guard';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Global()
@Module({
    imports: [SupabaseModule],
    providers: [JwtGuard],
    exports: [JwtGuard]
})
export class AuthModule {}
