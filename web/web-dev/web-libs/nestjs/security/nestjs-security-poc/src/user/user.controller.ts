import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest } from './create-user-request.dto';
import { CreateUserResponse } from './create-user-response.dto';
import { GetUserResponse } from './get-user-response.dto';
import { JwtAuthGuard } from '../security/auth.guard'; // Adjust path if needed
import { RolesGuard } from '../security/roles.guard';   // Adjust path if needed
import { Roles } from '../security/roles.decorator';     // Adjust path if needed
import { Role } from '../security/role.enum';             // Adjust path if needed
import { Public } from 'src/security/public.decorator';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

@Post()
@Public()
async create(
  @Body() createUserRequest: CreateUserRequest): Promise<CreateUserResponse> {
  try {
    // Let the service handle creation and throw if something goes wrong (e.g. duplicate email)
    const userCreated: User = await this.userService.create({
      name: createUserRequest.name,
      email: createUserRequest.email,
      password: createUserRequest.password,
      role: createUserRequest.role
    });

    // Only reached if creation was successful
    return {
      message: 'User created successfully',
      user: {
        name: userCreated.name,
        email: userCreated.email,
        password: userCreated.password,
        role: userCreated.role

      }
    };
  } catch (error) {
    // You can customize this based on error type later
    throw error; // Let NestJS handle it (e.g., BadRequestException → 400)
  }
}

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  async findOne(@Param('id') id: string): Promise<GetUserResponse> {


    const userFound: User = await this.userService.findOne(Number(id));

    return {
      id: userFound.id,
	    name: userFound.name
    }
  }
}
