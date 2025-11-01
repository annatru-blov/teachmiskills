import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Task } from './task.entity';
import { randomUUID } from 'crypto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class TasksService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly auth: AuthService,
  ) {}

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

  create(dto: CreateTaskDto, authHeader?: string): Task {
    const ownerId = this.auth.getUserIdOrThrow('', authHeader);
    const task: Task = {
      id: randomUUID(),
      title: dto.title,
      completed: dto.completed ?? false,
      ownerId,
    };

    this.tasks.push(task);

    return task;
  }

  async update(
    id: string,
    dto: UpdateTaskDto,
    authHeader?: string,
  ): Promise<Task> {
    await this.auth.assertsCanEditTask(id, authHeader);
    const task = await this.findOne(id);

    if (dto.title !== undefined) {
      task.title = dto.title;
    }

    if (dto.completed !== undefined) {
      task.completed = dto.completed;
    }

    return task;
  }

  async remove(id: string, authHeader?: string): Promise<void> {
    await this.auth.assertsCanEditTask(id, authHeader);
    const idx = this.tasks.findIndex((task) => task.id === id);

    if (idx === -1) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    this.tasks.splice(idx, 1);
  }
}
