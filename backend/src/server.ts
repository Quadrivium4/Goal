import dotenv from "dotenv"
dotenv.config();
import express from "express";
import connectDB from "./db.js"
import cors from "cors"
import { protectedRouter, publicRouter } from "./routes.js";
const app = express();
const port = 5000;
app.use(express.json())
app.use(cors());
app.use(publicRouter)
app.use("/protected", protectedRouter)
app.listen(port, async()=>{
    try{
        await connectDB(process.env.MONGO_URI);
        console.log(`Server listening on port ${port}`)
    }catch(err){
        console.log("Cannot start server:", err)
    }
})