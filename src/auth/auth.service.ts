import { ConflictException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException, Post, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { UserCredentialDto } from './dto/credential.dto';
import { hash, compare } from "bcryptjs"
@Injectable()
export class AuthService {
    
    constructor(
        @Inject() private readonly userService: UserService,
    ){}

    async register(credentialUser: UserCredentialDto){
        //validar si el email ya fue registrado
        const validateEmail = this.userService.findByEmail(credentialUser.email);

        if(!validateEmail){
            throw new ConflictException();
        }

        //Encriptar contraseña
        credentialUser.password = await hash(credentialUser.password, 10);

        //Registrar en la BD
        const userRegisted = this.userService.create({...credentialUser});
        if(!userRegisted){
            throw new InternalServerErrorException();
        }

        return HttpStatus.CREATED;
    }

    async login(userCredentials: UserCredentialDto){
        //Validamos si la cuenta existe
        const user = await this.userService.findByEmail(userCredentials.email);
        if(!user){
            throw new UnauthorizedException();
        }

        //Validamos si la contraseña es compatible
        const validatePassword = this.comparePassword(userCredentials.password, user.password);
        if(!validatePassword){
            throw new UnauthorizedException();
        }

        return HttpStatus.ACCEPTED;
    }

    comparePassword(userPassword: string, userDbPassword:string){
        return compare(userDbPassword, userPassword)
    }
    
}
