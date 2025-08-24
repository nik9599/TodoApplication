import express from 'express';
import routes from "./Routes/routes.js";
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express();
// new PGDB()

// Configure CORS for development (localhost:3000)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Parse JSON bodies BEFORE routes
app.use(express.json());

// Parse cookies BEFORE routes
app.use(cookieParser());

app.use('/', routes);

app.listen(8000, ()=>{
    console.log('Server started on port 8000');
});