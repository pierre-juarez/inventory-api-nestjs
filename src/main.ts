import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
