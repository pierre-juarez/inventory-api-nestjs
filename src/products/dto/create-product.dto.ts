import {
  IsString,
  IsNumber,
  IsPositive,
  Min,
  IsNotEmpty,
} from 'class-validator';
export class CreateProductDto {
  @IsString()
  @IsNotEmpty() // no permite un string vacío ""
  name!: string;
  @IsNumber()
  @IsPositive() // el precio debe ser mayor a 0
  price!: number;
  @IsNumber()
  @Min(0) // el stock no puede ser negativo
  stock!: number;
  @IsNumber()
  @Min(0)
  categoryId!: number; // a qué categoría pertenece el producto
}
