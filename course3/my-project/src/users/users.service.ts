import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { randomUUID } from 'crypto';
import { LoggerService } from 'src/logger/logger.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly logger: LoggerService) {}
  private users: User[] = [];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return user;
  }

  create(dto: CreateUserDto): User {
    const user: User = {
      id: randomUUID(),
      username: dto.username,
      email: dto.email,
    };
    this.users.push(user);

    this.logger.info(`User ${user.username} created`);
    return user;
  }

  update(id: string, dto: UpdateUserDto): User {
    const user = this.findOne(id);

    if (dto.username !== undefined) {
      user.username = dto.username;
    }

    if (dto.email !== undefined) {
      user.email = dto.email;
    }

    this.logger.warn(`User ${user.username} updated`);
    return user;
  }

  remove(id: string) {
    const idx = this.users.findIndex((user) => user.id === id);

    if (idx === -1) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    const [userDeleted] = this.users.splice(idx, 1);
    this.logger.warn(`User ${userDeleted.username} deleted`);
  }

  onModuleInit() {
    console.log('UsersService initialized');
  }
}
