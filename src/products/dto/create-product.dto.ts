import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsPositive,
  Min,
  IsNotEmpty,
} from 'class-validator';
export class CreateProductDto {
  @ApiProperty({ example: 'Laptop HP 15"' })
  @IsString()
  @IsNotEmpty() // no permite un string vacío ""
  name!: string;
  @ApiProperty({ example: 899.99, description: 'Debe ser mayor a 0' })
  @IsNumber()
  @IsPositive() // el precio debe ser mayor a 0
  price!: number;
  @ApiProperty({ example: 10, description: 'No puede ser negativo' })
  @IsNumber()
  @Min(0) // el stock no puede ser negativo
  stock!: number;
  @ApiProperty({ example: 1, description: 'ID de una categoría existente' })
  @IsNumber()
  @Min(0)
  categoryId!: number; // a qué categoría pertenece el producto
}
