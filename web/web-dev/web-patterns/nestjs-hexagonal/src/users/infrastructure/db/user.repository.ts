import { Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import { User } from "../../1domain/user.model.domain";
import { UserRepositoryPort } from "../../1domain/user.repository.domain";
import { InjectRepository } from '@nestjs/typeorm';

import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepositoryAdapter implements UserRepositoryPort {

  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

    async save(user: User): Promise<void> {
    await this.repo.save(this.toEntity(user));
  }

  // Domain → DB
  private toEntity(domain: User): UserEntity {
    const entity = new UserEntity();
    entity.name = domain.name;
    entity.age = domain.age;
    return entity;
  }
}


