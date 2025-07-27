import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
    private supabase: SupabaseClient;

    constructor(private readonly configService: ConfigService) {
        const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
        const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_KEY');

        if(!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase URL Key is missing from environment variables.')
        }

        this.supabase = createClient(supabaseUrl, supabaseKey)
    }

    getClient(): SupabaseClient {
        return this.supabase;
    }
}
