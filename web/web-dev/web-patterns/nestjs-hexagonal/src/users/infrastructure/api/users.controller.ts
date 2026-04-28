import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';

import { User } from '../../1domain/user.model.domain'
import { Inject } from '@nestjs/common';
import { CreateUserUseCase } from 'src/users/application/create-user.usecase';


@Controller('users')
export class UsersController {
  
  //constructor(private readonly usersService: UsersServiceAdapter) {}
  constructor(
      @Inject('CreateUserUseCase')
      private readonly createuserUseCase: CreateUserUseCase,
    ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
      const user = new User(
          createUserDto.name,
          createUserDto.age
        );
    return this.createuserUseCase.execute(user);
  }

}
