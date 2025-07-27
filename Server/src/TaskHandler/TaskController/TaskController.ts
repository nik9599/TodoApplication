import express from "express";

const taskRouter = express.Router();

taskRouter.post('/create')
taskRouter.get('/get')
taskRouter.put('/update')
taskRouter.delete('/delete')

export default taskRouter;