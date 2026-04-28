import { Injectable, Inject } from '@nestjs/common';
import { User } from '../1domain/user.model.domain';
import { UserRepositoryPort } from '../1domain/user.repository.domain';

@Injectable()
export class CreateUserUseCase {

  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepositoryPort: UserRepositoryPort
  ) {}

  async execute(createUser: User): Promise<void> {
    return this.userRepositoryPort.save(createUser);
  }
}