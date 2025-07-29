import express from "express";
import UserService from "../UserServices/UserService.js"

const userRouter = express.Router();

userRouter.use(express.json());

const userServices = new UserService()
userRouter?.post('/login', (req,res)=> userServices?.loginUser(req,res))
userRouter?.post('/signup', (req, res, next) => userServices.isUserUnique(req, res, next)  , (req,res)=> {userServices?.signUpUser(req,res)})
userRouter?.put('/update', (req, res, next) => userServices.userAuthenticated(req, res, next)  , (req,res)=> {userServices?.updateUser(req,res)})
userRouter?.delete('/delete',(req, res, next) => userServices.userAuthenticated(req, res, next)  , (req,res)=> {userServices?.deleteUser(req,res)})




export default userRouter;