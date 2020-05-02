import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task-dto';
import { FiltersDto } from './dto/filters-dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task.status.enum';

@Controller('tasks')
export class TasksController {
  constructor(private tasksServices: TasksService){}

  @Get()
  getTasks(@Query(ValidationPipe) filterDto: FiltersDto): Promise<Task[]> {
      return this.tasksServices.getTasks(filterDto);
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksServices.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksServices.createTask(createTaskDto);
  }

  @Delete('/:id')
  deleteTaskbyId(@Param('id', ParseIntPipe) id: number): Promise<void>{
    return this.tasksServices.deleteTask(id);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status:TaskStatus
  ): Promise<Task> {
    return this.tasksServices.updateTaskStatus(id, status);
  }

/*   @Get()
  getTasks(@Query(ValidationPipe) filterDto: FiltersDto) {
    if (Object.keys(filterDto).length) {
      return this.tasksServices.getFiltersTasks(filterDto);
    } else {
      return this.tasksServices.getAllTasks();
    }
  }





 

 */
}
