import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usuarioRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new BadRequestException('El correo ya está registrado');
    }
    // bcrypt.hash genera un hash irreversible de la contraseña, con "costo" 10 (qué tan lento/seguro es)
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const usuario = this.usuarioRepo.create({ email: dto.email, passwordHash });
    await this.usuarioRepo.save(usuario);
    return { id: usuario.id, email: usuario.email }; // nunca devolvemos el hash al cliente
  }

  async login(dto: LoginDto) {
    const usuario = await this.usuarioRepo.findOne({
      where: { email: dto.email, active: 1 },
    });
    if (!usuario) {
      throw new UnauthorizedException('Usuario no registrado.');
    }
    // bcrypt.compare compara la contraseña en texto plano contra el hash guardado
    const valid = await bcrypt.compare(dto.password, usuario.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Contraseña incorrecta.');
    }
    const payload = { sub: usuario.id, email: usuario.email };
    return { accessToken: this.jwtService.sign(payload) }; // firma y genera el JWT
  }
}
