import { IsNumber, IsOptional, IsPositive } from "class-validator"


export class ProductPaginationDto  {
    @IsNumber()
    @IsPositive()
    @IsOptional()
    skip?: number

    @IsNumber()
    @IsPositive()
    @IsOptional()
    limit?: number
}