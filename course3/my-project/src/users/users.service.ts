import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { randomUUID } from 'crypto';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class UsersService {
  constructor(private readonly logger: LoggerService) {}
  private users: User[] = [];

  findAll(): User[] {
    return this.users;
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

  onModuleInit() {
    console.log('UsersService initialized');
  }
}
