import { IsString, IsNotEmpty } from "class-validator";

export class CreateOrderDto {
    @IsString()
    @IsNotEmpty()
    command: string;
}
