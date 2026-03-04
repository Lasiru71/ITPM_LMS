
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js"

import financeRoutes from "./routes/finance.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";


dotenv.config();
connectDB()

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/finance", financeRoutes);
app.use("/api/attendance", attendanceRoutes);

app.get("/", (req,res)=>res.send("Finance + Attendance API Running"));

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDB Connected");
    app.listen(process.env.PORT || 3001, ()=>{
        console.log("Server running on port 3001");
    });
})
.catch(err=>console.log(err));
