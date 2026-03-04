
import mongoose from "mongoose";

const paymentSchema=new mongoose.Schema({
 studentId:String,
 courseId:String,
 amount:Number,
 method:{
  type:String,
  enum:["CARD","BANK_TRANSFER"]
 },
 status:{
  type:String,
  enum:["PENDING","APPROVED","REJECTED"],
  default:"PENDING"
 }
},{timestamps:true});

export default mongoose.model("Payment",paymentSchema);
