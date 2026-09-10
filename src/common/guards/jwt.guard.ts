import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// Extiende el AuthGuard de passport, usando la estrategia 'jwt' que definimos más abajo.
// Cuando lo usamos con @UseGuards(JwtGuard), Nest exige un header:
// Authorization: Bearer <token>
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {}
