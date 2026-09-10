import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';
@Entity('TB_PRODUCTOS')
export class Product {
  @PrimaryGeneratedColumn({ name: 'IDPROD' })
  id!: number;
  @Column({ name: 'NOMBRE', type: 'varchar', length: 100, nullable: false })
  name!: string;
  @Column({ name: 'PRECIO', type: 'decimal', precision: 10, scale: 2 })
  price: number = 0;
  @Column({ name: 'STOCK', type: 'int' })
  stock: number = 0;
  @Column({ name: 'IMAGEN', type: 'varchar', length: 255, nullable: true })
  image: string = '';
  @Column({ name: 'IDCAT', type: 'int' })
  categoryId: number = 0;
  @Column({ name: 'FECHA_CREACION', type: 'datetime' })
  createdAt: Date = new Date();
  // Esta relación le permite a TypeORM "seguir" el FK y traer el objeto Category completo
  @ManyToOne(() => Category, { eager: false }) // eager: false = no la trae automáticamente en cada query
  @JoinColumn({ name: 'IDCAT' }) // le indica cuál es la columna FK real en TB_PRODUCTOS
  category!: Category;
}
