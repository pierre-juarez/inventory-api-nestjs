import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';
import { JwtGuard } from '../common/guards/jwt.guard';
import { MulterExceptionFilter } from './multer-exception.filter';
import { UploadsService } from './uploads.service';
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
];
const MAX_FILE_SIZE_MB = 2;

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Get() // pública: para poder mostrar la imagen directo en el navegador/frontend
  getFiles() {
    throw new BadRequestException('Esta ruta no está implementada');
  }

  @Get(':name') // pública: para poder mostrar la imagen directo en el navegador/frontend
  getFile(@Param('name') name: string, @Res() res: Response) {
    const filePath = this.uploadsService.existeArchivo(name);
    if (!filePath)
      throw new NotFoundException(`Archivo "${name}" no encontrado`);
    res.sendFile(filePath, { root: '.' });
  }

  @UseGuards(JwtGuard) // solo un usuario logueado puede subir archivos
  @UseFilters(MulterExceptionFilter) // atrapa los errores de Multer y los traduce
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        // A qué carpeta del disco se guarda el archivo
        destination: (_req, _file, cb) => {
          const dir = process.env.UPLOADS_DIR ?? './uploads';
          mkdirSync(dir, { recursive: true }); // crea la carpeta si no existe
          cb(null, dir);
        },
        // Con qué nombre se guarda (evita que dos archivos con el mismo nombre se pisen)
        filename: (_req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 }, // límite en bytes
      fileFilter: (_req, file, cb) => {
        // Rechaza el archivo antes de guardarlo si el tipo no está permitido
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          return cb(
            new BadRequestException(
              `Tipo de archivo no permitido: "${file.mimetype}"`,
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        "En el campo Key escribe 'file' y selecciona tu imagen.",
      );
    }
    return {
      filename: file.filename,
      url: `${process.env.BASE_URL ?? ''}/uploads/${file.filename}`,
    };
  }
}
