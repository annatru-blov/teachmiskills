import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
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
    return user;
  }

  onModuleInit() {
    console.log('UsersService initialized');
  }
}
