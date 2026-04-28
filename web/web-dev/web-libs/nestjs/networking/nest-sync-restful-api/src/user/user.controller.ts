import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest } from './create-user-request.dto';
import { CreateUserResponse } from './create-user-response.dto';
import { GetUserResponse } from './get-user-response.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserRequest: CreateUserRequest): CreateUserResponse {
    return this.userService.create(createUserRequest);
  }

  @Get(':id')
  findOne(@Param('id') id: number): GetUserResponse {
    return this.userService.findOne(Number(id));
  }
}
