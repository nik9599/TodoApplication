import express from 'express';
import userRouter from "../User/UserController/UserController.js"
const routes = express.Router();

routes.use(express.json());

routes.use("/user", userRouter)

export default routes;