import { BadRequestException, Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class SuppliersService {
    constructor(private readonly supabaseService: SupabaseService) {}

    async getDashboardAnalytics(supplierId: string) {
        const client = this.supabaseService.getClient()

        const { count: totalGroupBuys, error: groupCountError} = await client
            .from('group_buys')
            .select('id', { count:'exact', head: true })
            .eq('supplier_id', supplierId);

        if (groupCountError) {
            throw new BadRequestException(groupCountError.message)
        }


        const { data: groupBuys, error: groupBuysError } = await client
            .from('group_buys')
            .select('id, price_per_unit, target_quantity, current_quantity, end_date, area_name, status')
            .eq('supplier_id', supplierId)
            .order('created_at', { ascending: false })
            .limit(5);


        if (groupBuysError || !groupBuys) {
            throw new BadRequestException(groupBuysError?.message || 'Failed to fetch group buys.');
        }

        const groupBuyIds = groupBuys.map(gb => gb.id);

        const { data: orderAggregates, error: orderAggError } = await client
            .from('orders')
            .select('group_buy_id, quantity', { count: 'exact' })
            .in('group_buy_id', groupBuyIds);

        if (orderAggError) {
            throw new BadRequestException(orderAggError.message);
        }

        const orderCountMap = new Map<string, number>()

        if (orderAggregates) {
            for (const order of orderAggregates) {
                const current = orderCountMap.get(order.group_buy_id) || 0;
                orderCountMap.set(order.group_buy_id, current+order.quantity);
            }
        }

        const totalOrderedQuantity = Array.from(orderCountMap.values()).reduce((sum, qty) => sum + qty, 0);

        const enrichedGroupBuys = groupBuys.map(gb => ({
            id: gb.id,
            price_per_unit: gb.price_per_unit,
            target_quantity: gb.target_quantity,
            current_quantity: gb.current_quantity,
            end_date: gb.end_date,
            area_name: gb.area_name,
            status: gb.status,
            ordered_quantity: orderCountMap.get(gb.id) || 0,
        }))

        return {
            total_group_buys: totalGroupBuys || 0,
            total_ordered_quantity: totalOrderedQuantity,
            recent_group_buys: enrichedGroupBuys,
        };
    }
}
