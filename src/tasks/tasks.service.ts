import { Injectable, NotFoundException, Controller } from '@nestjs/common';
import { TaskStatus } from './task.status.enum';
import { CreateTaskDto } from './dto/create-task-dto';
import { FiltersDto } from './dto/filters-dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ){}


  async getTasks(filters: FiltersDto): Promise<Task[]> {
    return await this.taskRepository.getTasks(filters);
  }

  async getTaskById(id: number): Promise<Task> {
    const foundTask = await this.taskRepository.findOne(id);
    if (!foundTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return foundTask;
  }

  async deleteTask(id: number): Promise<void> {
    /* One way, this way make 2 query to the database, first veify that exist the task and before deleted */
    /* const foundTask: Task = await this.getTaskById(id);
    foundTask.remove(); */

    /* Second way, faster, make only one request to database */
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    
  }

  async updateTaskStatus(id: number, staus:TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = staus;
    await task.save();
    return task;
  }
  
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

}
