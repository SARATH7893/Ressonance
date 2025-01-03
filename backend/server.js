import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postRoutes from "./routes/posts.routes.js"
import userRoutes from "./routes/user.routes.js"
dotenv.config()

const app=express()

app.use(cors())
app.use(express.json())
app.use(postRoutes)
app.use(userRoutes)
app.use(express.static("uploads"))


const start=async()=>{
    const connectDb=await mongoose.connect("")

    app.listen(9090,()=>{
        console.log("server is listening");
    })
}

start();