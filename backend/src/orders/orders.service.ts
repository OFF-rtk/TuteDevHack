import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from 'src/supabase/supabase.service';
import axios from 'axios';
import { ProductsService } from 'src/products/products.service';

export interface ParsedOrder {
  productName: string;
  quantity: number | string;
}

interface Product {
  id: string;
  name: string;
  image_url?: string;
}

interface GroupBuy {
  id: string;
  status: string;
  product_id: string;
  // add more fields if selected
}

interface Order {
  id: string;
  quantity: number;
  status: string;
  created_at: string;
  group_buys: GroupBuy;
  products: Product;
}


@Injectable()
export class OrdersService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly configService: ConfigService,
    private readonly productsService: ProductsService,
  ) {}

  async createFromVoice(vendorId: string, command: string) {
    // Parse command text using Gemini API
    const parsedOrder = await this.parseOrderWithAI(command);
    const { productName, quantity } = parsedOrder;

    // Supabase client instance
    const client = this.supabaseService.getClient();

    // Lookup product by case-insensitive name match
    const { data: product, error: productError } = await client
      .from('products')
      .select('id')
      .ilike('name', `%${productName}%`)
      .single();

    if (productError || !product) {
      throw new NotFoundException(`Product "${productName}" not found.`);
    }

    // Lookup active group buy for product
    const { data: groupBuy, error: groupBuyError } = await client
      .from('group_buys')
      .select('id')
      .eq('product_id', product.id)
      .eq('status', 'ACTIVE')
      .single();

    if (groupBuyError || !groupBuy) {
      throw new NotFoundException(`No active group buy found for "${productName}".`);
    }

    // Insert order -- ensure quantity is number
    const { error: orderError } = await client
      .from('orders')
      .insert({
        vendor_id: vendorId,
        group_buy_id: groupBuy.id,
        quantity, // already number due to parseOrderWithAI
      });

    if (orderError) {
      if (orderError.code === '23505') {
        throw new BadRequestException('You have already placed an order for this group buy.');
      }
      throw new InternalServerErrorException('Failed to create order.');
    }

    return {
      message: 'Order placed successfully!',
      parsedOrder,
    };
  }

  private async parseOrderWithAI(command: string): Promise<ParsedOrder> {
    const apiKey = this.configService.get<string>('GENAI_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException('Google Gemini API key (GENAI_KEY) not configured.');
    }

    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent';

    // Prompt to extract product and quantity as JSON only
    const promptText = `Extract the product and quantity from this user command. Respond ONLY with a valid JSON object containing "productName" and "quantity" keys. No other text.

    User command: "${command}"

    JSON:
    `;

    console.log('Gemini request body:', JSON.stringify({ contents: [ { parts: [ { text: promptText } ] } ] }, null, 2));

    try {
      const response = await axios.post(
        `${url}?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: promptText,
                },
              ],
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      // Extract the generated text from the first candidate
      const candidates = response.data.candidates;
      if (!candidates || candidates.length === 0) {
        throw new BadRequestException('No response candidates from Gemini API.');
      }

      const rawText = candidates[0].content.parts[0].text;

      if (!rawText) {
        throw new BadRequestException('Empty response text from Gemini API.');
      }

      // Extract the JSON block from the response text
      const jsonStart = rawText.indexOf('{');
      const jsonEnd = rawText.lastIndexOf('}');
      if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
        throw new BadRequestException('No valid JSON found in AI response.');
      }

      const jsonString = rawText.substring(jsonStart, jsonEnd + 1);

      // Parse JSON safely
      let parsed: ParsedOrder;
      try {
        parsed = JSON.parse(jsonString);
      } catch (error) {
        console.error('Failed to parse JSON from Gemini response:', error);
        console.error('Raw JSON string:', jsonString);
        throw new BadRequestException('Invalid JSON format from AI.');
      }

      // Normalize and validate quantity into a number
      let quantityNum: number;

      if (typeof parsed.quantity === 'number') {
        quantityNum = parsed.quantity;
      } else if (typeof parsed.quantity === 'string') {
        const match = parsed.quantity.match(/\d+(\.\d+)?/);
        if (!match) {
          throw new BadRequestException('Quantity in AI response is malformed.');
        }
        quantityNum = parseFloat(match[0]);
      } else {
        throw new BadRequestException('Quantity field missing or invalid in AI response.');
      }

      if (!parsed.productName || typeof parsed.productName !== 'string') {
        throw new BadRequestException('ProductName missing or invalid in AI response.');
      }

      return {
        productName: parsed.productName.toLowerCase(),
        quantity: quantityNum,
      };
    } catch (error: any) {
      console.error('Gemini API or parsing error:', error.response?.data || error.message || error);
      throw new InternalServerErrorException('Failed to process order with AI.');
    }
  }

  async placeOrder(vendorId: string, groupBuyId: string, quantity: number) {
    const client = this.supabaseService.getClient()

    const { data: groupBuy,  error: groupBuyError } = await client.from('group_buys').select('id, status').eq('id', groupBuyId).single();

    if(groupBuyError || !groupBuy) {
        throw new NotFoundException(`Group buy with ID ${groupBuyId} not found.`)
    }

    if(groupBuy.status !== 'ACTIVE') {
        throw new BadRequestException('Group buy is not active');
    }

    if(quantity <= 0) {
        throw new BadRequestException("Quantity must be greater than zero.");
    }

    const { error: orderError } = await client.from('orders').insert({
        vendor_id: vendorId,
        group_buy_id: groupBuyId,
        quantity,
    })

    if(orderError) {
        if(orderError.code === '23505') {
            throw new BadRequestException('You have already placed an order for this group buy.');
        }
        throw new InternalServerErrorException('Failed to create order.');
    }

    return {
        message: "Order Placed Successfully!"
    };
  }

  async getOrdersByVendor(vendorId: string): Promise<Order[]> {
    const client = this.supabaseService.getClient();

    // Step 1: Fetch orders with minimal fields, no nested relations
    const { data: orders, error: ordersError } = await client
      .from('orders')
      .select('id, quantity, status, created_at, group_buy_id')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });

    if (ordersError || !orders) {
      throw new InternalServerErrorException('Failed to fetch orders.');
    }

    if (orders.length === 0) {
      return [];
    }

    // Step 2: Fetch related group buys by IDs
    const groupBuyIds = [...new Set(orders.map(order => order.group_buy_id))];

    const { data: groupBuys, error: groupBuysError } = await client
      .from('group_buys')
      .select('id, status, product_id')
      .in('id', groupBuyIds);

    if (groupBuysError || !groupBuys) {
      throw new InternalServerErrorException('Failed to fetch group buys.');
    }

    // Map group buys by id
    const groupBuyMap = new Map(groupBuys.map(gb => [gb.id, gb]));

    // Step 3: Fetch products by unique product_ids from group buys
    const productIds = [...new Set(groupBuys.map(gb => gb.product_id))];

    const products = await this.productsService.findByIds(productIds);

    // Map products by id
    const productMap = new Map(products.map(p => [p.id, p]));

    // Step 4: Combine data into enriched order objects
    const enrichedOrders: Order[] = orders.map(order => {
      const groupBuy = groupBuyMap.get(order.group_buy_id);
      const product = groupBuy ? productMap.get(groupBuy.product_id) : undefined;

      return {
        ...order,
        group_buys: groupBuy || { id: '', status: '', product_id: '' },
        products: product || { id: '', name: '', image_url: undefined },
      };
    });

    return enrichedOrders;
  }

  async cancelOrder (vendorId: string, orderId: string) {
    const client = this.supabaseService.getClient();

    const { data: order, error: orderError} = await client
      .from('orders')
      .select('id, status, created_at, vendor_id')
      .eq('id', orderId)
      .eq('vendor_id', vendorId)
      .single()

    if(orderError || !order) {
      throw new NotFoundException(`Order with ID ${orderId} not found or doesn't belong to you.`);
    }

    if(order.status !== 'PLACED') {
      throw new BadRequestException('Only orders with PLACED status can be cancelled.');
    }

    const orderTime = new Date(order.created_at).getTime();
    const now = Date.now();
    const thrityMinutes = 30*60*1000;

    if(now - orderTime > thrityMinutes) {
      throw new BadRequestException('Orders can only be cancelled within 30 minutes of placement.')
    }

    const { error: updateError } = await client
      .from('orders')
      .update({ status: 'CANCELLED' })
      .eq('id', orderId)
      .eq('vendor_id', vendorId);

    if (updateError) {
      throw new InternalServerErrorException('Failed to cancel order.');
    }

    return {
      message: 'Order cancelled successfully',
    };
  }
}
