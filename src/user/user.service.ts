import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { hash } from 'bcryptjs';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ){}

  async create(createUserDto: CreateUserDto) {

    var password = createUserDto.password;
    
    if (!password) {
      throw new BadRequestException('La contraseña es obligatoria');
    }

    createUserDto.password = await hash(password, 10);
    
    const user  = await this.userModel.create(createUserDto);
    if(user == null){
      throw new InternalServerErrorException();
    }
  
    return HttpStatus.CREATED;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
