import express from 'express'
import 'dotenv/config'
import logger from 'morgan';
import connectDB  from './config/database.js';
import router from './routes/index.js'
import cookieParser from 'cookie-parser'

import corsConfig from './config/cors.config.js';

const app = express();

//Middlewares

app.use(cookieParser())
app.use(corsConfig)


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//router

app.use('/api',router)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "An unexpected error occurred." });
  });

(async function startServer(){
    try {
    await connectDB();
    const port = process.env.PORT
    console.log(port)
    app.listen(port,()=>{
        console.log(`Server running at port ${port}`)
    })  
    } catch (error) {
        console.log(error.message);
    }
})();


