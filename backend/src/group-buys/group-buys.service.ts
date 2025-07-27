import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CreateGroupBuyDto } from './dto/create-group-buy.dto';

@Injectable()
export class GroupBuysService {
    constructor(private readonly supabaseService: SupabaseService) {}

    async create(supplierId: string, dto: CreateGroupBuyDto) {
        const client = this.supabaseService.getClient()

        const { data: product, error: productError } = await client
            .from('products')
            .select('id, supplier_id')
            .eq('id', dto.product_id)
            .single()
        
        if (productError || !product) {
            throw new NotFoundException(`Product with ID "${dto.product_id}" not found.`);
        }

        if (product.supplier_id !== supplierId) {
            throw new BadRequestException('Cannot create group buy for a product not owned by you.')
        }

        if (new Date(dto.end_date) <= new Date()) {
            throw new BadRequestException('End date must be in the future.');
        }

        const { data, error } = await client
            .from('group_buys')
            .insert({
                supplier_id: supplierId,
                product_id: dto.product_id,
                end_date: dto.end_date,
                target_quantity: dto.target_quantity || 0,
                current_quantity: 0,
                price_per_unit: dto.price_per_unit,
                status: 'ACTIVE',
                area_name: dto.area_name,
                created_at: new Date().toISOString(),
            })
            .select()
            .single()

        if (error) {
            throw new BadRequestException('Failed to create group by: ' + error.message);
        }

        return {
            message: "Group Created Succesfully",
            data
        }
    }

    async findMine(supplierId: string) {
        const client = this.supabaseService.getClient()

        const { data: groupBuys, error: groupBuysError } = await client
            .from('group_buys')
            .select('id, price_per_unit, target_quantity, current_quantity, end_date, area_name, status, product_id, created_at')
            .eq('supplier_id', supplierId)
            .order('created_at', { ascending: false })

        if(groupBuysError) {
            throw new BadRequestException(`Failed to fetch group buys: ${groupBuysError.message}`);
        }

        if (groupBuys.length === 0) {
            return [];
        }

        const productIds = [...new Set(groupBuys.map(gb => gb.product_id))]

        const { data: products, error: productsError} = await client
            .from('products')
            .select('id, name, description, image_url')
            .in('id', productIds)

        if(productsError) {
            throw new BadRequestException(`Failed to fetch products: ${productsError.message}`);
        }

        const productMap = new Map(products.map(p => [p.id, p]));

        const enrichedGroupBuys = groupBuys.map(groupBuy => ({
            ...groupBuy,
            products: productMap.get(groupBuy.product_id) || { id: '', name: '', description: '', image_url: ''},
        }))

        return enrichedGroupBuys;
    }

    async findAll(vendorArea: string) {
        const client = this.supabaseService.getClient()
        const { data, error } = await client
            .from('group_buys')
            .select('*, products(*)')
            .eq('status', 'ACTIVE')
            .eq('area_name', vendorArea);
        
        if(error) {
            throw new Error(error.message);
        }

        return data;
    }

    async findOne(id: string) {
        const client = this.supabaseService.getClient()
        const { data, error } = await client
            .from('group_buys')
            .select('*, products(*)')
            .eq('id', id)
            .single()
        
        if(error) {
            throw new NotFoundException(`Group buy with ID "${id} not found.`);
        }

        return data;
    }
}
