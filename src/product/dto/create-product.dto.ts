import { IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength, MinLength } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(100)
    name!: string

    @IsString()
    @IsNotEmpty()
    @MinLength(20)
    description!: string
}
