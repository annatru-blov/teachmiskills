import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { randomUUID } from 'crypto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class TasksService {
  constructor(private readonly auth: AuthService) {}

  private tasks: Task[] = [];

  findAll(): Task[] {
    return this.tasks;
  }
  // eslint-disable-next-line @typescript-eslint/require-await
  async findOne(id: string): Promise<Task> {
    const task = this.tasks.find((task) => task.id === id);

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  create(dto: CreateTaskDto, userId: string): Task {
    this.auth.issueToken(userId);
    const task: Task = {
      id: randomUUID(),
      title: dto.title,
      completed: dto.completed ?? false,
      ownerId: userId,
    };

    this.tasks.push(task);

    return task;
  }

  private async getOwnerTask(id: string, token: string): Promise<Task> {
    if (!token) {
      throw new Error('access denied');
    }
    const ownerId = this.auth.verifyToken(token);
    const task = await this.findOne(id);
    if (task.ownerId !== ownerId) {
      throw new Error('access denied');
    }
    return task;
  }

  async update(id: string, dto: UpdateTaskDto, token: string): Promise<Task> {
    await this.getOwnerTask(id, token);
    const task = await this.findOne(id);

    if (dto.title !== undefined) {
      task.title = dto.title;
    }

    if (dto.completed !== undefined) {
      task.completed = dto.completed;
    }

    return task;
  }

  async remove(id: string, token: string): Promise<void> {
    await this.getOwnerTask(id, token);
    const idx = this.tasks.findIndex((task) => task.id === id);

    if (idx === -1) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    this.tasks.splice(idx, 1);
  }
}
