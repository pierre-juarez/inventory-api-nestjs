import { IsEmail, IsString, MinLength } from 'class-validator';
export class RegisterDto {
  @IsEmail() // valida formato de correo automáticamente
  email!: string;
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;
}
