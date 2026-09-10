import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../common/decorators/current-user.decorator';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      // Busca el token en el header: Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true, // si el token expiró, se rechaza automáticamente
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'), // misma clave usada para firmar el token
    });
  }
  // Passport llama automáticamente a validate() con el contenido del token ya decodificado.
  // Lo que devolvemos aquí es lo que terminará en request.user (usado por @CurrentUser)
  validate(payload: JwtPayload) {
    return payload;
  }
}
