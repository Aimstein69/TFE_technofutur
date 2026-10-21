import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByUsername(
    username: string,
  ): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        username,
      },
    });
  }

  async findByEmail(
    email: string,
  ): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findByIdentifier(
    identifier: string,
  ): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: [
        {
          username: identifier,
        },
        {
          email: identifier,
        },
      ],
    });

    return user;
  }

  async createUser(data: {
    username: string;
    email: string;
    passwordHash: string;
    language: string;
  }): Promise<User> {
    const user = this.usersRepository.create({
      username: data.username,
      email: data.email,
      passwordHash: data.passwordHash,
      language: data.language,
    });

    return this.usersRepository.save(user);
  }
  async verifyUserEmail(userId: string): Promise<void> {
  await this.usersRepository.update(
    userId,
    {
      isVerified: true,
    },
  );
}
}