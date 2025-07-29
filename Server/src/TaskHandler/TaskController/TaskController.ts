import express from "express";
import UserServices from "../../User/UserServices/UserService";
import TaskServices from "../TaskServices/TaskService";

const taskRouter = express.Router();

const UserService = new UserServices();
const TaskService = new TaskServices();

taskRouter.post('/create',UserService.userAuthenticated,(req, res, next)=>{
  TaskService.createTask(req, res);
})
taskRouter.get('/get',UserService.userAuthenticated,(req, res, next)=>{
  TaskService.getTaskByUserId(req, res);
})
taskRouter.put('/update',UserService.userAuthenticated,(req, res, next)=>{
  TaskService.updateTask(req, res);
})
taskRouter.delete('/delete',UserService.userAuthenticated,(req, res, next)=>{
  TaskService.deleteTask(req, res);
})

export default taskRouter;