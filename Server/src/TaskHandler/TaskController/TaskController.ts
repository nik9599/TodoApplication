import express from "express";
import UserServices from "../../User/UserServices/UserService.js";
import TaskServices from "../TaskServices/TaskService.js";

const taskRouter = express.Router();

const UserService = new UserServices();
const TaskService = new TaskServices();

taskRouter.use(express.json());

// Note: Logging is handled by the main routes middleware to avoid duplicates

taskRouter.post('/create',UserService.userAuthenticated,(req, res, next)=>{
  TaskService.createTask(req, res);
})
taskRouter.get('/get',UserService.userAuthenticated,(req, res, next)=>{
  TaskService.getTaskByUserId(req, res);
})
taskRouter.put('/update',UserService.userAuthenticated,(req, res, next)=>{
  TaskService.updateTask(req, res);
})
taskRouter.delete('/delete/:id',UserService.userAuthenticated,(req, res, next)=>{
  TaskService.deleteTask(req, res);
})
taskRouter.post('/update-priorities',UserService.userAuthenticated,(req, res, next)=>{
  TaskService.triggerPriorityUpdate(req, res);
})

export default taskRouter;