
import mongoose from "mongoose";

const sessionSchema=new mongoose.Schema({
 courseId:String,
 lecturerId:String,
 token:String,
 expiresAt:Date
});

export default mongoose.model("AttendanceSession",sessionSchema);
