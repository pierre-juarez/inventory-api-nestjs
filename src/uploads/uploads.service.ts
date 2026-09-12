import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadsService {
  readonly uploadsDir = process.env.UPLOADS_DIR ?? './uploads';

  existeArchivo(name: string) {
    const filePath = path.join(this.uploadsDir, path.basename(name));
    return fs.existsSync(filePath) ? filePath : null;
  }
}
