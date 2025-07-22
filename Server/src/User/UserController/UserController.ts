import express from "express";
import UserService from "../UserServices/UserService.js"

const userRouter = express.Router();

const userServices = new UserService()
userRouter?.get('/login/:id', (req,res)=> userServices?.loginUser(req,res))



export default userRouter;