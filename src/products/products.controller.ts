import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post() // http://localhost:3000/products -- POST
  crearProducto(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Post('/ruta2') // http://localhost:3000/products/ruta2
  crearProducto2() {
    return this.productsService.getProductsRaw();
  }

  @Get() // GET /products — pública, cualquiera puede listar, // http://localhost:3000/products -- GET
  findAll() {
    return this.productsService.getProductosAll();
  }

  @Get(':id') // GET /products/5 — pública http://localhost:3000/products/1520 - GET
  findOne(@Param('id', ParseIntPipe) id: number) {
    // ParseIntPipe convierte el ":id" (que llega como texto "5") a número 5,
    // y responde 400 automáticamente si alguien manda algo que no es un número
    return this.productsService.getOneProducto(id);
  }
  // @UseGuards(JwtGuard)
  @Patch(':id') // http://localhost:3000/products/1520 - PATCH
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }
  // @UseGuards(JwtGuard)
  @Delete(':id') // http://localhost:3000/products/1520 - DELETE
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.eliminarProducto(id);
  }
}
