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

  async getTaskById(id: number): Promise<Task> {
    const foundTask = await this.taskRepository.findOne(id);
    if (!foundTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return foundTask;
  }

  
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task: Task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    await task.save();
    return task;
  }

/*   getAllTasks() {
    return this.tasks;
  }

  getFiltersTasks(filtersDto: FiltersDto) {
    const { search, status } = filtersDto;
    let tasks: Task[] = this.getAllTasks();

    if (search) {
      tasks = tasks.filter(task => task.title.includes(search) || task.description.includes(search));
    }

    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }

    return tasks;
  }




  updateTaskStatus(id: string, staus:TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = staus;
    return task;
  }

  deleteTaskById(id: string): void {
    const foundTask = this.getTaskById(id);
    this.tasks = this.tasks.filter(task => task.id !== foundTask.id);
  } */
}
