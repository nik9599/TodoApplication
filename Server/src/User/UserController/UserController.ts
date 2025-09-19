import express from "express";
import UserService from "../UserServices/UserService.js"

const userRouter = express.Router();

userRouter.use(express.json());

// Note: Logging is handled by the main routes middleware to avoid duplicates

const userServices = new UserService()
userRouter?.post('/login', (req,res)=> userServices?.loginUser(req,res))
userRouter?.post('/signup', (req, res, next) => userServices.isUserUnique(req, res, next)  , (req,res)=> {userServices?.signUpUser(req,res)})
userRouter?.get('/verify-token', (req, res, next) => userServices.userAuthenticated(req, res, next), (req,res)=> userServices?.verifyToken(req,res))
userRouter?.put('/update', (req, res, next) => userServices.userAuthenticated(req, res, next)  , (req,res)=> {userServices?.updateUser(req,res)})
userRouter?.delete('/delete',(req, res, next) => userServices.userAuthenticated(req, res, next)  , (req,res)=> {userServices?.deleteUser(req,res)})
userRouter?.get('/logout',(req,res)=> userServices?.logoutUser(req,res))




export default userRouter;