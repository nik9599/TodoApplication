import express from 'express';
import routes from "./Routes/routes.js";
import cors from 'cors'

const app = express();
// new PGDB()

app.use(cors())

app.use('/', routes);
app.use(express.json());

app.listen(8000, ()=>{
    console.log('Server started on port 8000');
});