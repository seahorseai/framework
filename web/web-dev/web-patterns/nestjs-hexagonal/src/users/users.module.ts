import { Module } from '@nestjs/common';

import { UsersController } from './infrastructure/api/users.controller';
import { UserRepositoryAdapter } from './infrastructure/db/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infrastructure/db/user.entity';
import { CreateUserUseCase } from './application/create-user.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity])  
  ],
  controllers: [UsersController],
  providers: [CreateUserUseCase,
    UserRepositoryAdapter,
    {
      provide: 'UserRepositoryPort',
      useClass: UserRepositoryAdapter,
    },

  ],
})
export class UsersModule {}
