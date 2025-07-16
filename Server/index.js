import logsData from "./logData.js"
import express from "express";

const app = express();

app.use(express.json());
 app.use(express.urlencoded({ extended: true }))

 app.get('/', (req, res) => {

     logsData('/', 'hello routes')
     res.end('Hello World!');
 });

app.listen(8000, ()=>{
    console.log('Server is running');
});