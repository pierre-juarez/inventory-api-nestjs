import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
// import { UploadsModule } from './uploads/uploads.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    // Carga el .env y lo deja disponible en toda la app (isGlobal: true)
    ConfigModule.forRoot({ isGlobal: true }),
    // forRootAsync: espera a que ConfigModule esté listo antes de armar la conexión a MySQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => databaseConfig(config),
    }),
    ProductsModule,
    AuthModule,
    UploadsModule,
    /** ProductsModule,
 AuthModule,
 UploadsModule, **/
  ],
})
export class AppModule {}
