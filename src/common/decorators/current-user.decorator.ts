import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// Forma del contenido que guardamos dentro del JWT (el "payload")
export interface JwtPayload {
  sub: number; // id del usuario ("subject")
  email: string;
}
// Este decorador nos deja escribir @CurrentUser() en cualquier controlador
// para obtener directamente el usuario ya autenticado, sin repetir código
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user; // passport ya dejó el usuario aquí después de validar el JWT
  },
);
