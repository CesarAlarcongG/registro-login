import { Body, Controller, Inject, Injectable, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { UserCredentialDto } from './dto/credential.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(
        @Inject() private readonly authService: AuthService , 
    ){}

    @Post("register")
    userRegister(@Body() userCredentials: UserCredentialDto){
        return this.authService.register(userCredentials);
    }

    @Post("login")
    login(@Body() credentialUser: UserCredentialDto){
        return this.authService.login(credentialUser);
    }

}
