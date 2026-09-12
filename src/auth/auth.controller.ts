import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register') // POST /auth/register
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado correctamente (no devuelve el password).',
  })
  @ApiResponse({ status: 400, description: 'El correo ya está registrado.' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
  @Post('login') // POST /auth/login
  @ApiOperation({ summary: 'Iniciar sesión y obtener un JWT' })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso, devuelve el accessToken (JWT).',
  })
  @ApiResponse({
    status: 401,
    description: 'Usuario no registrado o contraseña incorrecta.',
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
