import { Injectable } from '@nestjs/common';
import { CreateUserRequest } from './create-user-request.dto';
import { CreateUserResponse } from './create-user-response.dto';
import { User } from './user.entity';
import { GetUserResponse } from './get-user-response.dto';

@Injectable()
export class UserService {
  users: User[] = [];

  findOne(id: number): GetUserResponse {
    const foundUser: User = this.users.find(user => user.id === id);

    if (!foundUser) {
      throw new Error(`User with id ${id} not found`);
    }

    const getUserResponse: GetUserResponse = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      password: foundUser.password,
    };
    return getUserResponse;
  }

  create(createUserRequest: CreateUserRequest): CreateUserResponse {
    const newUserId = this.users.length + 1;
    const newUser: User = { ...createUserRequest, id: newUserId };
    this.users.push(newUser);

    const createUserResponse: CreateUserResponse = {
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
    };
    return createUserResponse;
  }
}
