import { Repository, EntityRepository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from './dto/create-task-dto';
import { TaskStatus } from "./task.status.enum";
import { FiltersDto } from './dto/filters-dto';
import { User } from '../auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

  async createTask(
    createTaskDto: CreateTaskDto,
    user: User
  ): Promise<Task>{
    const { title, description } = createTaskDto;
    const task: Task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    await task.save();
    // this is for not show the user property on the response
    delete task.user;
    return task;
  }

  async getTasks(filters: FiltersDto, user: User): Promise<Task[]>{
    const { search, status } = filters;
    const { id } = user;
    const query = this.createQueryBuilder('task');
    
    query.where('task.userId = :userId', {userId: id});

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