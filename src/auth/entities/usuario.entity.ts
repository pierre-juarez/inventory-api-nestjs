import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity('TB_USUARIO')
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'IDUSER' })
  id!: number;
  @Column({ name: 'EMAIL', type: 'varchar', length: 100 })
  email: string = '';
  @Column({ name: 'PASSWORD_HASH', type: 'varchar', length: 255 })
  passwordHash: string = '';
  @Column({ name: 'ACTIVO', type: 'tinyint', default: 1 })
  active: number = 1;
}
