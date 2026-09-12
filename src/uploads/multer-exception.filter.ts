import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
// @Catch(BadRequestException) — este filtro solo intercepta ese tipo de error,
// que es justo el que lanza Multer cuando el archivo no cumple las reglas (tamaño, tipo, etc.)
@Catch(BadRequestException)
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const message = exception.message;
    // Convertimos el mensaje técnico de Multer en uno entendible para el usuario final
    if (message.includes('File too large')) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'El archivo excede el tamaño máximo permitido (2 MB)',
      });
    }
    response.status(HttpStatus.BAD_REQUEST).json(exception.getResponse());
  }
}
