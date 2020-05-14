import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task-dto';
import { FiltersDto } from './dto/filters-dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task.status.enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksServices: TasksService){}

  @Get()
  getTasks(
    @Query(ValidationPipe) filterDto: FiltersDto,
    @GetUser() user: User
  ): Promise<Task[]> {
      return this.tasksServices.getTasks(filterDto, user);
  }

  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksServices.getTaskById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User
  ): Promise<Task> {
    return this.tasksServices.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  deleteTaskbyId(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void>{
    return this.tasksServices.deleteTask(id, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status:TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksServices.updateTaskStatus(id, status, user);
  }

}
