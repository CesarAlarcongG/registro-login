import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { UserCredentialDto } from './dto/credential.dto';
import { hash, compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/user/entities/user.entity';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(credentialUser: UserCredentialDto) {
    //validar si el email ya fue registrado
    const validateEmail = await this.userService.findByEmail(
      credentialUser.email,
    );

    if (validateEmail) {
      throw new ConflictException();
    }

    //Encriptar contraseña
    credentialUser.password = await hash(credentialUser.password, 10);

    //Registrar en la BD
    const userRegisted = await this.userService.create({ ...credentialUser });
    if (!userRegisted) {
      throw new InternalServerErrorException();
    }
    return this.generateToken(userRegisted);
  }

  async login(userCredentials: UserCredentialDto) {
    const user = await this.userService.findByEmail(userCredentials.email);
    if (!user) {
      throw new UnauthorizedException(
        'No hay un usuario registrado con este email',
      );
    }

    const validatePassword = await this.comparePassword(
      userCredentials.password,
      user.password,
    );

    if (!validatePassword) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    return this.generateToken(user);
  }

  generateToken(user: UserDocument) {
    const payload = {
      sub: user._id,
      email: user.email,
      firtsName: user.firstName,
    };

    return {
      acces_token: this.jwtService.sign(payload),
    };
  }

  comparePassword(userPassword: string, userDbPassword: string) {
    return compare(userDbPassword, userPassword);
  }
}
