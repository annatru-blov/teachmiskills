import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { UpdateTaskDto } from 'src/src/tasks/dto/update-task.dto';
import { TasksService } from 'src/src/tasks/tasks.service';

@Injectable()
export class DiffInterceptor implements NestInterceptor {
  constructor(private readonly tasksService: TasksService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest() as any;

    if (request.method !== 'PATCH') {
      return next.handle();
    }

    const id = request.params.id;

    if (!id) {
      return next.handle();
    }

    const oldData = await this.tasksService.findOne(id);
    const newData = request.body;

    const diff = this.getDiff(oldData, newData);

    return next.handle().pipe(
      map((data) => ({
        ...data,
        diff,
      })),
    );
  }

  getDiff(oldData: UpdateTaskDto, newData: UpdateTaskDto) {
    const diff = {};
    for (const key in newData) {
      if (oldData[key] !== newData[key]) {
        diff[key] = {
          old: oldData[key],
          new: newData[key],
        };
      }
    }
    return diff;
  }
}
