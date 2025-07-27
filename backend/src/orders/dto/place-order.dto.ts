import { IsString, IsNotEmpty, IsNumber, Min } from "class-validator";

export class PlaceOrderDto {
    @IsString()
    @IsNotEmpty()
    group_buy_id: string;

    @IsNumber()
    @Min(1)
    quantity: number;
}