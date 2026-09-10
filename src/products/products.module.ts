import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  // forFeature registra estas entidades para que @InjectRepository funcione dentro de este módulo
  imports: [TypeOrmModule.forFeature([Product, Category])],
})
export class ProductsModule {}
