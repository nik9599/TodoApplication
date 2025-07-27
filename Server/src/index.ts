import express from 'express';
import routes from "./Routes/routes.js";
// import {PGDB} from "./Databases/pgDB.js";

const app = express();
// new PGDB()

app.use('/', routes);
app.use(express.json());

app.listen(8000, ()=>{
    console.log('Server started on port 8000');
});