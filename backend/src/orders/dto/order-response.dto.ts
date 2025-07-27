import { IsString, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { Type } from 'class-transformer'

export class ProductDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    image_url?: string;
}

export class GroupBuyDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    status: string;

    @IsString()
    @IsNotEmpty()
    product_id: string;
}

export class OrderResponseDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNumber()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString() // ISO date string validation can be more elaborate with custom decorators if needed
  @IsNotEmpty()
  created_at: string;

  @ValidateNested()
  @Type(() => GroupBuyDto)
  group_buys: GroupBuyDto;

  @ValidateNested()
  @Type(() => ProductDto)
  products: ProductDto;
}