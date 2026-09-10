import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
// PartialType hace que todos los campos de CreateProductDto sean opcionales,
// así en un PATCH puedes enviar solo el campo que quieres actualizar
export class UpdateProductDto extends PartialType(CreateProductDto) {}
