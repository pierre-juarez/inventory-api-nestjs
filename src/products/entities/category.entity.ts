import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('TB_CATEGORIA') // le dice a TypeORM: esta clase representa la tabla TB_CATEGORIA
export class Category {
  @PrimaryGeneratedColumn({ name: 'IDCAT' }) // llave primaria, columna real: IDCAT
  id!: number;

  @Column({ name: 'NOMBRE', type: 'varchar', length: 50 }) // columna real: NOMBRE
  name: string = '';

  @Column({ name: 'ACTIVO', type: 'tinyint', default: 1 }) // columna real: ACTIVO
  active: number = 1;
}
