import express from 'express';
import userRouter from "../User/UserController/UserController.js"
const routes = express.Router();

routes.get("/user", userRouter)

export default routes;