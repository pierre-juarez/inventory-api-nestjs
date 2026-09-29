import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina del objeto las propiedades que no tengan un decorador de validación en el DTO
      forbidNonWhitelisted: true, // Lanza un error 400 si llegan propiedades extra no definidas en el DTO (en vez de solo descartarlas)
      transform: true, // Convierte automáticamente el payload al tipo declarado en el DTO (ej. string -> number, JSON -> instancia de clase)
    }),
  );

  // Configuración de Swagger (documentación interactiva de la API)
  const config = new DocumentBuilder()
    .setTitle('Inventory CRUD API')
    .setDescription(
      'API para gestión de inventario: productos, categorías, autenticación y subida de imágenes.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Pega aquí el accessToken devuelto por POST /auth/login (sin el prefijo "Bearer ")',
      },
      'access-token', // nombre de referencia usado en @ApiBearerAuth('access-token')
    )
    .addTag('auth', 'Registro e inicio de sesión')
    .addTag('products', 'CRUD de productos')
    .addTag('uploads', 'Subida y consulta de imágenes')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  // Documentación disponible en http://localhost:3000/api
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
