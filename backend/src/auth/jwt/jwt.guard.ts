import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class JwtGuard implements CanActivate {

  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers['authorization'];

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.split(' ')[1];
    try {const { data: { user }, error, } = await this.supabaseService.getClient().auth.getUser(token);

    if(error || !user) {
      throw new UnauthorizedException('Invalid or Expired token');
    }

    const { data: profile } = await this.supabaseService
      .getClient()
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    req.user = { ...user, ...profile}
    return true;} catch (err) {
      throw new UnauthorizedException('Token Verification or Profile Fetch Failed')
    }
  }
}
