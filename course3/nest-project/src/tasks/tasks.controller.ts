import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Headers,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}
  @Get()
  findAll() {
    return this.tasks.findAll();
  }

  @Post()
  create(@Body() dto: CreateTaskDto, @Headers('authorization') auth?: string) {
    return this.tasks.create(dto, auth);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.tasks.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTaskDto,
    @Headers('Authorization') auth?: string,
  ) {
    return this.tasks.update(id, dto, auth);
  }

  @Delete(':id')
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Headers('Authorization') auth?: string,
  ) {
    this.tasks.remove(id, auth);
    return { success: true, id };
  }
}
