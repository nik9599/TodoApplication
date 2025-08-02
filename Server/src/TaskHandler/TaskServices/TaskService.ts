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

  async createTask(req: any, res: any) {
    try {
      const { title, description, completed, priority, userId } = req.body;
      const isUserExists = await this.UserService.isUserExists(userId);
      if (!isUserExists) {
        return res.status(400).json({ message: "User not found", isError: true, data: [] });
      }
      if(!title || !description || !priority || !userId){
        return res.status(400).json({ message: "Title, description, priority, userId are required", isError: true, data: [] });
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
        userId: userId || "No user id"
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
      const { userId } = req.body;
      const result = await this.TaskRepository.getTaskByUserId(userId);
      if (result?.length > 0) {
        return res.status(200).json({ message: "Task fetched successfully", data: result });
      }
      else {
        return res.status(400).json({ message: "No task found", isError: false, data: [] });
      }
    }
    catch (error) {
      return res.status(400).json({ message: "Task fetching failed", isError: true, data: [] });
    }
  }

  async updateTask(req: any, res: any) {
    try {
      const { id, title, description, completed, priority, userId }: Task = req.body;
      const isTaskExists = await this.TaskRepository.getTaskById(id);
      if (!isTaskExists) {
        return res.status(400).json({ message: "Task not found", isError: false, data: [] });
      }
      if(!id || !title || !description || !priority || !userId){
        return res.status(400).json({ message: "Task id, title, description, priority, userId are required", isError: true, data: [] });
      }
      const task: Task = {
        id,
        title: title || "Untitled",
        description: description || "No description",
        completed: completed || false,
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: priority || "low",
        userId: userId || "No user id"
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
      const { id } = req.body;
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
