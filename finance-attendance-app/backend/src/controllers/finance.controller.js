
import Payment from "../models/Payment.js";
import Course from "../models/Course.js";
import sendEmail from "../utils/mailer.js";

export const createPayment=async(req,res)=>{
 const {studentId,courseId,method}=req.body;
 const course=await Course.findById(courseId);

 const payment=await Payment.create({
  studentId,
  courseId,
  amount:course.fee,
  method
 });

 res.json(payment);
};

export const pendingPayments=async(req,res)=>{
 const payments=await Payment.find({status:"PENDING"});
 res.json(payments);
};

export const approvePayment=async(req,res)=>{
 const payment=await Payment.findByIdAndUpdate(
  req.params.id,
  {status:"APPROVED"},
  {new:true}
 );

 await sendEmail("student@email.com","Payment Approved","Your payment has been approved");
 res.json(payment);
};

export const rejectPayment=async(req,res)=>{
 const payment=await Payment.findByIdAndUpdate(
  req.params.id,
  {status:"REJECTED"},
  {new:true}
 );

 res.json(payment);
};
