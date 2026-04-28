import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserRequest } from './create-user-request.dto';
import * as bcrypt from 'bcrypt';

interface User {
  id: number;
  name: string;
  email: string;
  password: string; // will store hashed password
  role: 'user' | 'admin';
}

@Injectable()
export class UserService {
  private users: User[] = [];
  private nextId = 1;



  // In user.service.ts

async create(createUserRequest: CreateUserRequest): Promise<User> {
  const hashedPassword = await bcrypt.hash(createUserRequest.password, 10);

  const newUser: User = {
    id: this.nextId++,
    name: createUserRequest.name,
    email: createUserRequest.email,
    password: hashedPassword,
    role: createUserRequest.role
  };

  this.users.push(newUser);

  return newUser;

  
}

async findOne(id: number): Promise<User | null> {
  const user = this.users.find((u) => u.id === id);

  if (!user) {
    throw new NotFoundException(`User with id ${id} not found`);
  }

  return user;
}


  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((u) => u.email === email);
    return user || null;
  }

  // Optional: for creating admin users during testing
  async createAdmin(email: string, password: string, name: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin: User = {
      id: this.nextId++,
      email,
      password: hashedPassword,
      name,
      role: 'admin',
    };
    this.users.push(admin);
    return admin;
  }
}