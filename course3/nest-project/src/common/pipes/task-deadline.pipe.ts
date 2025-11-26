import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { TaskPriority } from '../task-priority.enum';

@Injectable()
export class TaskDeadlinePipe implements PipeTransform {
  readonly priorityDeadlines = [
    TaskPriority.HIGH,
    TaskPriority.MEDIUM,
    TaskPriority.LOW,
  ];
  transform(value: any) {
    const { priority, deadline } = value;
    const nowDate = new Date();
    const userDeadline = new Date(deadline);

    if (!priority) {
      return value;
    }

    if (priority === TaskPriority.HIGH) {
      const minDate = new Date(nowDate.getTime() + 24 * 60 * 60 * 1000);
      if (userDeadline < minDate) {
        throw new BadRequestException(
          'Invalid deadline: for high priority task deadline should be at least than 24 hours',
        );
      }
    } else if (priority === TaskPriority.MEDIUM) {
      if (userDeadline <= nowDate) {
        throw new BadRequestException(
          'Invalid deadline: for medium priority task deadline should be greater than now',
        );
      }
    }

    return value;
  }
}
