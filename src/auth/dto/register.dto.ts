import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
export class RegisterDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail() // valida formato de correo automáticamente
  email!: string;
  @ApiProperty({ example: 'secret123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;
}
