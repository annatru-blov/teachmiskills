import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { randomUUID } from 'crypto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  findAll(): Task[] {
    return this.tasks;
  }
  findOne(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  create(dto: CreateTaskDto): Task {
    const task: Task = {
      id: randomUUID(),
      title: dto.title,
      completed: dto.completed ?? false,
    };

    this.tasks.push(task);

    return task;
  }

  update(id: string, dto: UpdateTaskDto): Task {
    const task = this.findOne(id);

    if (dto.title !== undefined) {
      task.title = dto.title;
    }

    if (dto.completed !== undefined) {
      task.completed = dto.completed;
    }

    return task;
  }

  remove(id: string): void {
    const idx = this.tasks.findIndex((task) => task.id === id);

    if (idx === -1) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    this.tasks.splice(idx, 1);
  }
}
