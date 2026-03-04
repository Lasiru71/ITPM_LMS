
import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title:String,
  fee:Number
});

export default mongoose.model("Course",courseSchema);
