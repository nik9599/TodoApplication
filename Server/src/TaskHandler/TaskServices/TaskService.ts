import TaskRepository from "./TaskRepository";
import { Task } from "../TaskInterface/TaskInterface";

class TaskServices {
  private TaskRepository: TaskRepository;

  constructor() {
    this.TaskRepository = new TaskRepository();
  }

  async createTask(req: any, res: any) {
    const { title, description, completed, priority, userId } = req.body;
    const task: Task = {
      id: String(this.TaskRepository?.getAllTaskLength()),
      title,
      description,
      completed: completed || false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: priority || "low",
      userId,
    };
    const result = await this.TaskRepository.createTask(task);
    if (result) {
      return res
        .status(200)
        .json({ message: "Task created successfully", data: result });
    } else {
      return res.status(400).json({ message: "Task creation failed" });
    }
  }

  async getTaskByUserId(req:any,res:any){
    try{
      const {userId} = req.body;
      const result = await this.TaskRepository.getTaskByUserId(userId);
      if(result){
        return res.status(200).json({message: "Task fetched successfully", data: result});
      }
    }
    catch(error){
      return res.status(400).json({message: "Task fetching failed"});
    }
  }

  async updateTask(req:any,res:any){
    try{
      const {id, title, description, completed, priority, userId} = req.body;
      const task:Task = {
        id,
        title,
        description,
        completed: completed || false,
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: priority || "low",
        userId
      }
      const result = await this.TaskRepository.updateTask(task);
      if(result){
        return res.status(200).json({message: "Task updated successfully", data: result});
      }
    }
    catch(error){
      return res.status(400).json({message: "Task updating failed"});
    }
  }

  async deleteTask(req:any,res:any){
    const {id} = req.body;
    const result = await this.TaskRepository.deleteTask(id);
    if(result){
      return res.status(200).json({message: "Task deleted successfully", data: result});
    }
    else{
      return res.status(400).json({message: "Task deletion failed"});
    }
  }
}

export default TaskServices;
