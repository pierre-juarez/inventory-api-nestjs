import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
// Esta función arma el objeto de configuración que TypeORM necesita para conectarse.
// La separamos en su propio archivo para no ensuciar app.module.ts.
export const databaseConfig = (
  config: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: config.get<string>('DB_HOST'), // IP del VPS (o "localhost" si usas Docker)
  port: parseInt(config.get<string>('DB_PORT') ?? '3306', 10),
  username: config.get<string>('DB_USERNAME'),
  password: config.get<string>('DB_PASSWORD'),
  database: config.get<string>('DB_DATABASE'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'], // busca automáticamente todas las *.entity.ts del proyecto
  synchronize: false, // NUNCA true — la BD ya existe y fue creada a mano, Nest solo la mapea
  // logging: config.get<string>('NODE_ENV') === 'development', // imprime el SQL generado, útil para aprender
  logging: true, // imprime el SQL generado, útil para aprender
});
