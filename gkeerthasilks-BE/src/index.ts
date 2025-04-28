import express from "express";
import dotenv from 'dotenv';
import { contactRouter } from "./router/contactRouter";

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;


// Middleware to parse JSON requests
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
  
    next();
  });

app.use("/courses",contactRouter)
app.use("/contact",contactRouter)

app.listen(port,()=>{
    console.log("server is running port",port);   
})