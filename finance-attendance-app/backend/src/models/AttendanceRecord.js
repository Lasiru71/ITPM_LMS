
import mongoose from "mongoose";

const recordSchema=new mongoose.Schema({
 sessionId:String,
 studentId:String,
 courseId:String,
 markedAt:{
  type:Date,
  default:Date.now
 }
});

recordSchema.index({sessionId:1,studentId:1},{unique:true});

export default mongoose.model("AttendanceRecord",recordSchema);
