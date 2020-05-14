import { Injectable, NotFoundException, Controller } from '@nestjs/common';
import { TaskStatus } from './task.status.enum';
import { CreateTaskDto } from './dto/create-task-dto';
import { FiltersDto } from './dto/filters-dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ){}


  async getTasks(filters: FiltersDto, user: User): Promise<Task[]> {
    return await this.taskRepository.getTasks(filters, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const foundTask = await this.taskRepository.findOne({where: {id, userId: user.id}});
    if (!foundTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return foundTask;
  }

  async deleteTask(id: number, user: User): Promise<void> {
    /* One way, this way make 2 query to the database, first veify that exist the task and before deleted */
    /* const foundTask: Task = await this.getTaskById(id);
    foundTask.remove(); */

    /* Second way, faster, make only one request to database */
    const result = await this.taskRepository.delete({ id, userId: user.id });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    
  }

  async updateTaskStatus(id: number, staus:TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = staus;
    await task.save();
    return task;
  }
  
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

}
