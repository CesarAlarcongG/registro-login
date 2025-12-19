import { Body, Controller, Inject, Injectable, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {

    constructor(
        @Inject() private readonly userService: UserService, 
    ){}

    @Post()
    userRegister(@Body() createUserDto: CreateUserDto){
        this.userService.create(createUserDto);
    }
}
