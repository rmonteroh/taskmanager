import { Repository, EntityRepository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from './dto/create-task-dto';
import { TaskStatus } from "./task.status.enum";
import { FiltersDto } from './dto/filters-dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

  async createTask(createTaskDto: CreateTaskDto): Promise<Task>{
    const { title, description } = createTaskDto;
    const task: Task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    await task.save();
    return task;
  }

  async getTasks(filters: FiltersDto): Promise<Task[]>{
    const { search, status } = filters;
    const query = this.createQueryBuilder('task');
    if (status) {
      query.andWhere('task.status = :status', {status});
    }

    if (search) {
      query.andWhere('task.title LIKE :search or task.description LIKE :search ', {search: `%${search}%`}); // partial match
    }

    const tasks = await query.getMany()
    return tasks;
  }
}