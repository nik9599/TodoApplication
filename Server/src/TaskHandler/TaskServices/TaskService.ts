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
    // Start priority update scheduler
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

  // Function to calculate days difference between current date and due date
  private calculateDaysDifference(dueDate: Date): number {
    const currentDate = new Date();
    const dueDateTime = new Date(dueDate);
    
    // Reset time to compare only dates
    currentDate.setHours(0, 0, 0, 0);
    dueDateTime.setHours(0, 0, 0, 0);
    
    const timeDifference = dueDateTime.getTime() - currentDate.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    
    return daysDifference;
  }

  // Function to determine priority based on days difference
  private getPriorityByDueDate(daysDifference: number): string {
    if (daysDifference < 0) {
      return 'high'; // Overdue tasks
    } else if (daysDifference <= 5) {
      return 'high'; // Due within 5 days
    } else if (daysDifference <= 10) {
      return 'medium'; // Due within 6-10 days
    } else {
      return 'low'; // Due in more than 10 days
    }
  }

  // Function to update task priorities based on due dates
  async updateTaskPrioritiesByDueDate() {
    try {
      console.log('=== UPDATING TASK PRIORITIES BY DUE DATE ===');
      
      // Get all tasks with due dates
      const allTasks = await this.TaskRepository.getAllTasks();
      console.log(`Found ${allTasks?.length || 0} total tasks`);
      
      if (!allTasks || allTasks.length === 0) {
        console.log('No tasks found to update');
        return;
      }

      let updatedCount = 0;
      const currentDate = new Date();

      for (const task of allTasks) {
        // Skip tasks without due dates or completed tasks
        if (!task.dueDate || task.completed) {
          continue;
        }

        const daysDifference = this.calculateDaysDifference(task.dueDate);
        const newPriority = this.getPriorityByDueDate(daysDifference);
        
        console.log(`Task ${task.id}: Due in ${daysDifference} days, Current priority: ${task.priority}, New priority: ${newPriority}`);

        // Only update if priority needs to change
        if (task.priority !== newPriority) {
          const updatedTask: Task = {
            ...task,
            priority: newPriority,
            updatedAt: currentDate
          };

          await this.TaskRepository.updateTask(updatedTask);
          updatedCount++;
          console.log(`✅ Updated task ${task.id} priority from ${task.priority} to ${newPriority}`);
        }
      }

      console.log(`=== PRIORITY UPDATE COMPLETE: Updated ${updatedCount} tasks ===`);
    } catch (error: any) {
      console.error('Error updating task priorities:', error);
    }
  }

  // Function to start the priority update scheduler
  private startPriorityUpdateScheduler() {
    console.log('Starting priority update scheduler...');
    
    // Run immediately on server start
    this.updateTaskPrioritiesByDueDate();
    
    // Run every hour to check for priority updates
    setInterval(() => {
      this.updateTaskPrioritiesByDueDate();
    }, 60 * 60 * 1000); // 1 hour in milliseconds
    
    console.log('Priority update scheduler started - will run every hour');
  }

  // Function to manually trigger priority update (can be called via API)
  async triggerPriorityUpdate(req: any, res: any) {
    try {
      console.log('Manual priority update triggered');
      await this.updateTaskPrioritiesByDueDate();
      return res.status(200).json({ 
        message: "Task priorities updated successfully", 
        data: { updated: true } 
      });
    } catch (error: any) {
      console.error('Error in manual priority update:', error);
      return res.status(500).json({ 
        message: "Failed to update task priorities", 
        error: error.message 
      });
    }
  }

  async createTask(req: any, res: any) {
    try {
      console.log('=== CREATE TASK DEBUG ===');
      console.log('Request body:', req.body);
      const { title, description, completed, priority, userId, dueDate } = req.body;
      console.log('Extracted values:', { title, description, completed, priority, userId, dueDate });
      
      const isUserExists = await this.UserService.isUserExists(userId);
      console.log('User exists check:', isUserExists);
      if (!isUserExists) {
        console.log('User not found, returning error');
        return res.status(400).json({ message: "User not found", isError: true, data: [] });
      }
      if(!title || !description || !priority || !userId){
        console.log('Missing required fields:', { title: !!title, description: !!description, priority: !!priority, userId: !!userId });
        return res.status(400).json({ message: "Title, description, priority, userId are required", isError: true, data: [] });
      }

      let parsedDueDate: Date | null = null;
      if (dueDate) {
        console.log('Processing dueDate:', dueDate);
        const tmp = new Date(dueDate);
        console.log('Parsed dueDate:', tmp);
        if (isNaN(tmp.getTime())) {
          console.log('Invalid dueDate format');
          return res.status(400).json({ message: "Invalid dueDate", isError: true, data: [] });
        }
        parsedDueDate = tmp;
      }

      const taskLength = await this.TaskRepository?.getAllTaskLength();
      console.log('Task length for ID generation:', taskLength);
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
      console.log('Task object to create:', task);
      const result = await this.TaskRepository.createTask(task);
      console.log('Repository result:', result);
      if (result) {
        console.log('Task created successfully');
        return res
          .status(200)
          .json({ message: "Task created successfully", data: result });
      } else {
        console.log('Task creation failed in repository');
        return res.status(400).json({ message: "Task creation failed", isError: true, data: [] });
      }
    }
    catch (error) {
      console.log('Error in createTask:', error);
      return res.status(400).json({ message: "Task creation failed", isError: true, data: [] });
    }
  }

  async getTaskByUserId(req: any, res: any) {
    try {
      // For GET requests, userId comes from query parameters, not body
      const { userId } = req.query;
      console.log("🔍 Getting tasks for userId:", userId);
      
      if (!userId) {
        return res.status(400).json({ message: "userId is required", isError: true, data: [] });
      }
      
      const result = await this.TaskRepository.getTaskByUserId(userId);
      if (result?.length > 0) {
        console.log("✅ Found", result.length, "tasks for user", userId);
        return res.status(200).json({ message: "Task fetched successfully", data: result });
      }
      else {
        console.log("📭 No tasks found for user", userId);
        return res.status(200).json({ message: "No task found", isError: false, data: [] });
      }
    }
    catch (error) {
      console.log("💥 Error fetching tasks:", error);
      return res.status(400).json({ message: "Task fetching failed", isError: true, data: [] });
    }
  }

  async updateTask(req: any, res: any) {
    try {
      console.log('=== UPDATE TASK DEBUG ===');
      console.log('Request body:', req.body);
      const { id, title, description, completed, priority, userId, dueDate }: Task = req.body;
      console.log('Extracted values:', { id, title, description, completed, priority, userId, dueDate });
      
      const isTaskExists = await this.TaskRepository.getTaskById(id);
      console.log('Task exists check:', isTaskExists);
      if (!isTaskExists) {
        console.log('Task not found, returning error');
        return res.status(400).json({ message: "Task not found", isError: false, data: [] });
      }
      if(!id || !title || !description || !priority || !userId){
        console.log('Missing required fields:', { id: !!id, title: !!title, description: !!description, priority: !!priority, userId: !!userId });
        return res.status(400).json({ message: "Task id, title, description, priority, userId are required", isError: true, data: [] });
      }

      let parsedDueDate: Date | null = null;
      if (dueDate) {
        console.log('Processing dueDate:', dueDate);
        const tmp = new Date(dueDate);
        console.log('Parsed dueDate:', tmp);
        if (isNaN(tmp.getTime())) {
          console.log('Invalid dueDate format');
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
      console.log('Task object to update:', task);
      const result = await this.TaskRepository.updateTask(task);
      console.log('Repository update result:', result);
      if (result) {
        console.log('Task updated successfully');
        return res.status(200).json({ message: "Task updated successfully", data: result });
      }
    }
    catch (error) {
      console.log('Error in updateTask:', error);
      return res.status(400).json({ message: "Task updating failed", isError: true, data: [] });
    }
  }

  async deleteTask(req: any, res: any) {
    try {
      console.log('=== DELETE TASK DEBUG ===');
      console.log('Request params:', req.params);
      const { id } = req.params;
      console.log('Task ID to delete:', id);
      
      const isTaskExists = await this.TaskRepository.getTaskById(id);
      console.log('Task exists check:', isTaskExists);
      if (!isTaskExists) {
        console.log('Task not found, returning error');
        return res.status(400).json({ message: "Task not found", isError: false, data: [] });
      }
      const result = await this.TaskRepository.deleteTask(id);
      console.log('Repository delete result:', result);
      if (result) {
        console.log('Task deleted successfully');
        return res.status(200).json({ message: "Task deleted successfully", data: result });
      } else {
        console.log('Task deletion failed in repository');
        return res.status(400).json({ message: "Task deletion failed", isError: true, data: [] });
      }
    }
    catch (error) {
      console.log('Error in deleteTask:', error);
      return res.status(400).json({ message: "Task deletion failed", isError: true, data: [] });
    }
  }
}

export default TaskServices;
