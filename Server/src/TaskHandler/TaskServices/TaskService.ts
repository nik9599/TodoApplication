import TaskRepository from "./TaskRepository.js";
import { Task } from "../TaskInterface/TaskInterface.js";
import UserService from "../../User/UserServices/UserService.js";

class TaskServices {
  private TaskRepository: TaskRepository;
  private UserService: UserService;
  private isTaskTableExists: boolean = false;

  constructor() {
    this.TaskRepository = new TaskRepository();
    this.createTable();
    this.UserService = new UserService();
    this.startPriorityUpdateScheduler();
  }

  async createTable() {
    await this.TaskRepository?.createTable();
  }

  async checkIfTableExists() {
    const result = await this.TaskRepository?.checkIfTableExists();
    if (result?.length > 0) {
      this.isTaskTableExists = true;
    } else {
      await this.TaskRepository?.createTable();
      this.isTaskTableExists = false;
    }
  }

  private calculateDaysDifference(dueDate: Date): number {
    const currentDate = new Date();
    const dueDateTime = new Date(dueDate);
    
    currentDate.setHours(0, 0, 0, 0);
    dueDateTime.setHours(0, 0, 0, 0);
    
    const timeDifference = dueDateTime.getTime() - currentDate.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    
    return daysDifference;
  }

  private getPriorityByDueDate(daysDifference: number): string {
    if (daysDifference < 0) {
      return 'high';
    } else if (daysDifference <= 5) {
      return 'high';
    } else if (daysDifference <= 10) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  private isPriorityUpgrade(currentPriority: string, newPriority: string): boolean {
    const priorityLevels: { [key: string]: number } = {
      'low': 0,
      'medium': 1,
      'high': 2
    };

    const currentLevel = priorityLevels[currentPriority.toLowerCase()] ?? 0;
    const newLevel = priorityLevels[newPriority.toLowerCase()] ?? 0;

    return newLevel > currentLevel;
  }

  async updateTaskPrioritiesByDueDate() {
    try {
      const allTasks = await this.TaskRepository.getAllTasks();
      
      if (!allTasks || allTasks.length === 0) {
        return;
      }

      let updatedCount = 0;
      const currentDate = new Date();

      for (const task of allTasks) {
        const dueDateValue = (task as any).dueDate || (task as any).duedate;

        if (!dueDateValue || task.completed) {
          continue;
        }

        const currentPriority = (task.priority || '').toLowerCase();
        if (currentPriority === 'high') {
          continue;
        }

        const daysDifference = this.calculateDaysDifference(dueDateValue);
        const newPriority = this.getPriorityByDueDate(daysDifference);

        if (task.priority !== newPriority) {
          if (!this.isPriorityUpgrade(task.priority, newPriority)) {
            continue;
          }

          const updatedTask: Task = {
            id: task.id,
            title: task.title,
            description: task.description,
            completed: task.completed || false,
            createdAt: (task as any).createdat ? new Date((task as any).createdat) : ((task as any).createdAt ? new Date((task as any).createdAt) : currentDate),
            updatedAt: currentDate,
            priority: newPriority,
            userId: (task as any).userid || (task as any).userId || (task as any).user_id || '',
            dueDate: dueDateValue ? new Date(dueDateValue) : null
          };
          await this.TaskRepository.updateTask(updatedTask);
          updatedCount++;
        }
      }
    } catch (error: any) {
    }
  }

  private startPriorityUpdateScheduler() {
    this.updateTaskPrioritiesByDueDate();
    
    setInterval(() => {
      this.updateTaskPrioritiesByDueDate();
    }, 60 * 60 * 1000);
  }

  async triggerPriorityUpdate(req: any, res: any) {
    try {
      await this.updateTaskPrioritiesByDueDate();
      return res.status(200).json({ 
        message: "Task priorities updated successfully", 
        data: { updated: true } 
      });
    } catch (error: any) {
      return res.status(500).json({ 
        message: "Failed to update task priorities", 
        error: error.message 
      });
    }
  }

  async createTask(req: any, res: any) {
    try {
      const { title, description, completed, priority, userId, dueDate } = req.body;
      const isUserExists = await this.UserService.isUserExists(userId);
      if (!isUserExists) {
        return res.status(400).json({ message: "User not found", isError: true, data: [] });
      }
      if(!title || !description || !priority || !userId){
        return res.status(400).json({ message: "Title, description, priority, userId are required", isError: true, data: [] });
      }

      let parsedDueDate: Date | null = null;
      if (dueDate) {
        const tmp = new Date(dueDate);
        if (isNaN(tmp.getTime())) {
          return res.status(400).json({ message: "Invalid dueDate", isError: true, data: [] });
        }
        parsedDueDate = tmp;
      }

      const taskLength = await this.TaskRepository?.getAllTaskLength();
      const task: Task = {
        id: String(taskLength),
        title: title || "Untitled",
        description: description || "No description",
        completed: completed || false,
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: priority || "low",
        userId: userId || "No user id",
        dueDate: parsedDueDate,
      };
      const result = await this.TaskRepository.createTask(task);
      if (result) {
        return res
          .status(200)
          .json({ message: "Task created successfully", data: result });
      } else {
        return res.status(400).json({ message: "Task creation failed", isError: true, data: [] });
      }
    }
    catch (error) {
      return res.status(400).json({ message: "Task creation failed", isError: true, data: [] });
    }
  }

  async getTaskByUserId(req: any, res: any) {
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ message: "userId is required", isError: true, data: [] });
      }
      
      const result = await this.TaskRepository.getTaskByUserId(userId);
      if (result?.length > 0) {
        return res.status(200).json({ message: "Task fetched successfully", data: result });
      }
      else {
        return res.status(200).json({ message: "No task found", isError: false, data: [] });
      }
    }
    catch (error) {
      return res.status(400).json({ message: "Task fetching failed", isError: true, data: [] });
    }
  }

  async updateTask(req: any, res: any) {
    try {
      const { id, title, description, completed, priority, userId, dueDate }: Task = req.body;
      
      const isTaskExists = await this.TaskRepository.getTaskById(id);
      if (!isTaskExists) {
        return res.status(400).json({ message: "Task not found", isError: false, data: [] });
      }
      if(id === '' || title === '' || description === '' || priority === '' || userId === ''){
        return res.status(400).json({ message: "Task id, title, description, priority, userId are required", isError: true, data: [] });
      }

      let parsedDueDate: Date | null = null;
      if (dueDate) {
        const tmp = new Date(dueDate);
        if (isNaN(tmp.getTime())) {
          return res.status(400).json({ message: "Invalid dueDate", isError: true, data: [] });
        }
        parsedDueDate = tmp;
      }

      const task: Task = {
        id,
        title: title || "Untitled",
        description: description || "No description",
        completed: completed || false,
        createdAt: isTaskExists.createdat || new Date(),
        updatedAt: new Date(),
        priority: priority || "low",
        userId: userId || "No user id",
        dueDate: parsedDueDate,
      }
      const result = await this.TaskRepository.updateTask(task);
      if (result) {
        return res.status(200).json({ message: "Task updated successfully", data: result });
      }
    }
    catch (error) {
      return res.status(400).json({ message: "Task updating failed", isError: true, data: [] });
    }
  }

  async deleteTask(req: any, res: any) {
    try {
      const { id } = req.params;
      
      const isTaskExists = await this.TaskRepository.getTaskById(id);
      if (!isTaskExists) {
        return res.status(400).json({ message: "Task not found", isError: false, data: [] });
      }
      const result = await this.TaskRepository.deleteTask(id);
      if (result) {
        return res.status(200).json({ message: "Task deleted successfully", data: result });
      } else {
        return res.status(400).json({ message: "Task deletion failed", isError: true, data: [] });
      }
    }
    catch (error) {
      return res.status(400).json({ message: "Task deletion failed", isError: true, data: [] });
    }
  }
}

export default TaskServices;
