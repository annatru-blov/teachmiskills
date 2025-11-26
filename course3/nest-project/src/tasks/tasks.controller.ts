import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  HttpCode,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
  ParseBoolPipe,
  UseGuards,
  UsePipes,
  UseInterceptors,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';
import { completeManyDto } from './dto/complete-many.dto';
import { ApiKeyGuard } from '../common/quards/api-key.quard';
import { OwnerGuard } from '../common/quards/owner.guard';
import { JwtGuard } from '../common/quards/jwt.guard';
import { NormalizeTaskPipe } from '../common/pipes/normalize-task.pipe';
import { LoggerInterceptor } from '../common/interceptors/logger.interceptors';
import { ResponceTransformInterceptor } from '../common/interceptors/responce-transform.interceptor';
import { TaskDeadlinePipe } from '../common/pipes/task-deadline.pipe';
import { DiffInterceptor } from '../common/interceptors/diff.interceptor';

@Controller('tasks')
@UseInterceptors(LoggerInterceptor, ResponceTransformInterceptor)
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  // @Get('whoami')
  // async getUser(@CurrentUser() user) {
  //   return user ?? { message: 'no user' };
  // }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('completed', ParseBoolPipe) completed?: boolean,
    @Query('title') title?: string,
  ) {
    const { data, total } = await this.tasks.findAll(
      page,
      limit,
      completed,
      title,
    );

    return {
      data,
      meta: {
        page,
        limit,
        total,
      },
    };
  }

  @Post()
  @HttpCode(201)
  @UsePipes(NormalizeTaskPipe, TaskDeadlinePipe)
  create(@Body() dto: CreateTaskDto) {
    return this.tasks.create(dto);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const task = await this.tasks.findOne(id);
    return task;
  }

  @Patch(':id')
  @UseGuards(JwtGuard, OwnerGuard)
  @UseInterceptors(DiffInterceptor)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTaskDto,
    // @Headers('authorization') auth: string,
  ) {
    return this.tasks.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  @HttpCode(204)
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    // @Headers('authorization') auth: string,
  ) {
    this.tasks.remove(id);
  }

  // @Patch(':id/complete')
  // complete(
  //   @Param('id', new ParseUUIDPipe()) id: string,
  //   // @Headers('authorization') auth: string,
  // ) {
  //   return this.tasks.complete(id);
  // }

  @Patch('complete')
  completeMany(@Body() dto: completeManyDto) {
    return this.tasks.completeMany(dto.ids);
  }

  @Patch(':id/restore')
  restore(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.tasks.restore(id);
  }
}
