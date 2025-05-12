import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';


const app = express();
import myRouter from './library.js';
import PostRouter from './CreateBook.js';

app.use(cors({
     origin: 'http://localhost:5000', 
  credentials: true,
}))
app.use(cookieParser());
app.use(express.json());
app.use(myRouter);


app.use(PostRouter);
const PORT = process.env.PORT || 3000;



app.listen(PORT,() => {
    console.log("listening!")
})