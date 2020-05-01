import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task-dto';
import { FiltersDto } from './dto/filters-dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private tasksServices: TasksService){}


  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksServices.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksServices.createTask(createTaskDto);
  }

/*   @Get()
  getTasks(@Query(ValidationPipe) filterDto: FiltersDto) {
    if (Object.keys(filterDto).length) {
      return this.tasksServices.getFiltersTasks(filterDto);
    } else {
      return this.tasksServices.getAllTasks();
    }
  }





  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status:TaskStatus
  ): Task {
    return this.tasksServices.updateTaskStatus(id, status);
  }

  @Delete('/:id')
  deleteTaskbyId(@Param('id') id: string): void{
    return this.tasksServices.deleteTaskById(id);
  } */
}
