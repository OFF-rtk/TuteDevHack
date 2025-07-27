import { IsUUID, IsNotEmpty, IsOptional, IsNumber, IsString, IsDateString, Min } from "class-validator";

export class CreateGroupBuyDto {
    @IsUUID()
    product_id: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsDateString()
    end_date: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    target_quantity?: number;

    @IsNotEmpty()
    @IsString()
    area_name: string;

    @IsNumber()
    @Min(0)
    price_per_unit: number;
}