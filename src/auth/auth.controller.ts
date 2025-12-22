import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { UserCredentialDto } from './dto/credential.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(@Inject() private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async userRegister(@Body() userCredentials: UserCredentialDto) {
    return this.authService.register(userCredentials);
  }

  @Post('login')
  @HttpCode(HttpStatus.ACCEPTED)
  async login(@Body() credentialUser: UserCredentialDto) {
    return this.authService.login(credentialUser);
  }
}
