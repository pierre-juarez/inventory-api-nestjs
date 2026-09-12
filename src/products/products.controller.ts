import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Post() // http://localhost:3000/products -- POST
  @ApiOperation({ summary: 'Crear un producto (requiere JWT)' })
  @ApiResponse({ status: 201, description: 'Producto creado.' })
  @ApiResponse({ status: 400, description: 'La categoría indicada no existe.' })
  @ApiResponse({ status: 401, description: 'Falta o es inválido el token JWT.' })
  crearProducto(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Post('/ruta2') // http://localhost:3000/products/ruta2
  @ApiOperation({
    summary: 'Listado plano de productos en stock (con nombre de categoría)',
  })
  @ApiResponse({ status: 201, description: 'Lista de productos (raw query).' })
  crearProducto2() {
    return this.productsService.getProductsRaw();
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Get() // GET /products — pública, cualquiera puede listar, // http://localhost:3000/products -- GET
  @ApiOperation({ summary: 'Listar todos los productos (requiere JWT)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos con su categoría.',
  })
  @ApiResponse({ status: 401, description: 'Falta o es inválido el token JWT.' })
  findAll() {
    return this.productsService.getProductosAll();
  }

  @Get(':id') // GET /products/5 — pública http://localhost:3000/products/1520 - GET
  @ApiOperation({ summary: 'Obtener un producto por ID (pública)' })
  @ApiParam({ name: 'id', example: 1520, description: 'ID del producto' })
  @ApiResponse({ status: 200, description: 'Producto encontrado.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    // ParseIntPipe convierte el ":id" (que llega como texto "5") a número 5,
    // y responde 400 automáticamente si alguien manda algo que no es un número
    return this.productsService.getOneProducto(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Patch(':id') // http://localhost:3000/products/1520 - PATCH
  @ApiOperation({ summary: 'Actualizar un producto (requiere JWT)' })
  @ApiParam({ name: 'id', example: 1520, description: 'ID del producto' })
  @ApiResponse({ status: 200, description: 'Producto actualizado.' })
  @ApiResponse({ status: 401, description: 'Falta o es inválido el token JWT.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Delete(':id') // http://localhost:3000/products/1520 - DELETE
  @ApiOperation({ summary: 'Eliminar un producto (requiere JWT)' })
  @ApiParam({ name: 'id', example: 1520, description: 'ID del producto' })
  @ApiResponse({ status: 200, description: 'Producto eliminado.' })
  @ApiResponse({ status: 401, description: 'Falta o es inválido el token JWT.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.eliminarProducto(id);
  }
}
