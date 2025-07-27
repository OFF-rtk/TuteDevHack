import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
    constructor(private readonly supabaseService: SupabaseService) {}

    async findAll() {
        const client = this.supabaseService.getClient();
        const { data, error } = await client.from('products').select('*');

        if(error) {
            throw new Error(error.message);
        }

        return data;
    }

    async findByIds(ids: string[]) {
        const client = this.supabaseService.getClient();
        const { data, error } = await client
            .from('products')
            .select('*')
            .in('id', ids);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    async create(supplierId: string, dto: CreateProductDto) {
        const client = this.supabaseService.getClient()

        const { error } = await client
            .from('products')
            .insert({
                ...dto,
                supplier_id: supplierId,
                created_at: new Date().toISOString(),
            })
            .single()

        if (error) {
            throw new BadRequestException(`Failed to create product: ${error.message}`);
        }
        return { message: 'Product created successfully' };
    }

    async update(
        productId: string,
        supplierId: string,
        dto: Partial<CreateProductDto>,
    ) {
        const client = this.supabaseService.getClient();

        const { data: existing, error: fetchErr } = await client
            .from('products')
            .select('supplier_id')
            .eq('id', productId)
            .single();

        if (fetchErr || !existing) {
            throw new NotFoundException('Product not found')
        }
        if (existing.supplier_id != supplierId) {
            throw new BadRequestException('You cannot update a product you do not own');
        }

        const { data, error } = await client
            .from('products')
            .update({ ...dto, updated_at: new Date().toISOString() })
            .eq('id', productId)
            .single();
        
        if (error) {
            throw new BadRequestException(`Failed to update product: ${error.message}`);
        }
        return data;
    }

    async findMine(supplierId: string) {
        const client = this.supabaseService.getClient();
        const { data, error } = await client
            .from('products')
            .select('*')
            .eq('supplier_id', supplierId)

        if (error) throw new BadRequestException(error.message);
        return data;
    }

    // In products.service.ts

    async findAvailableInArea(vendorId: string) {
        const client = this.supabaseService.getClient();


        const { data: vendorProfile, error: vendorError } = await client
            .from('profiles')
            .select('area_name') // or whatever column stores the vendor's area
            .eq('id', vendorId)
            .single();

        if (vendorError || !vendorProfile) {
            throw new BadRequestException('Vendor profile not found');
        }

        const vendorArea = vendorProfile.area_name;

        // Step 1: Get all active group buys in vendor's area
        const { data: groupBuys, error: groupBuysError } = await client
            .from('group_buys')
            .select('id, price_per_unit, target_quantity, current_quantity, end_date, area_name, supplier_id, product_id')
            .eq('status', 'ACTIVE')
            .eq('area_name', vendorArea)
            .order('end_date', { ascending: true });

        if (groupBuysError || !groupBuys) {
            throw new BadRequestException(`Failed to fetch group buys: ${groupBuysError?.message}`);
        }

        if (groupBuys.length === 0) {
            return [];
        }

        // Step 2: Get unique product IDs and supplier IDs
        const productIds = [...new Set(groupBuys.map(gb => gb.product_id).filter(Boolean))];
        const supplierIds = [...new Set(groupBuys.map(gb => gb.supplier_id).filter(Boolean))];

        // Step 3: Fetch products by IDs
        const { data: products, error: productsError } = await client
            .from('products')
            .select('id, name, description, image_url')
            .in('id', productIds);

        if (productsError || !products) {
            throw new BadRequestException(`Failed to fetch products: ${productsError?.message}`);
        }

        // Step 4: Fetch supplier profiles by IDs  
        const { data: profiles, error: profilesError } = await client
            .from('profiles')
            .select('id, full_name')
            .in('id', supplierIds);

        if (profilesError || !profiles) {
            throw new BadRequestException(`Failed to fetch supplier profiles: ${profilesError?.message}`);
        }

        // Step 5: Create lookup maps for efficient joining
        const productMap = new Map(products.map(p => [p.id, p]));
        const profileMap = new Map(profiles.map(p => [p.id, p]));

        // Step 6: Combine all data into enriched group buy objects
        const enrichedGroupBuys = groupBuys.map(groupBuy => {
        const product = productMap.get(groupBuy.product_id);
        const profile = profileMap.get(groupBuy.supplier_id);

        return {
        ...groupBuy,
        products: product || { id: '', name: '', description: '', image_url: '' },
        profiles: profile || { id: '', full_name: '' },
        };
    });

    return enrichedGroupBuys;
    }
}
