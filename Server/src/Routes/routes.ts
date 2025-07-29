import express from 'express';
import userRouter from "../User/UserController/UserController.js"
import taskRouter from '../TaskHandler/TaskController/TaskController.js';
const routes = express.Router();

routes.use(express.json());

routes.use("/user", userRouter)
routes.use("/task", taskRouter)

export default routes;