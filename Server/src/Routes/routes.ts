import express from 'express';
import userRouter from "../User/UserController/UserController.js"
import taskRouter from '../TaskHandler/TaskController/TaskController.js';
import logRouter from '../Logs/LogController/LogController.js';
import LogMiddleware from '../Logs/LogMiddleware/LogMiddleware.js';

const routes = express.Router();
const logMiddleware = new LogMiddleware();

routes.use(express.json());

// Apply smart logging middleware to all routes (handles all cases)
routes.use(logMiddleware.logApiRequests());

routes.use("/user", userRouter)
routes.use("/task", taskRouter)
routes.use("/logs", logRouter)

export default routes;