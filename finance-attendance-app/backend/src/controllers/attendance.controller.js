
import crypto from "crypto";
import AttendanceSession from "../models/AttendanceSession.js";
import AttendanceRecord from "../models/AttendanceRecord.js";

export const createSession=async(req,res)=>{
 const token=crypto.randomBytes(10).toString("hex");

 const session=await AttendanceSession.create({
  courseId:req.body.courseId,
  lecturerId:req.body.lecturerId,
  token,
  expiresAt:new Date(Date.now()+10*60*1000)
 });

 res.json(session);
};

export const markAttendance=async(req,res)=>{
 const session=await AttendanceSession.findOne({token:req.body.token});

 if(!session) return res.status(400).json({message:"Invalid QR"});
 if(new Date()>session.expiresAt) return res.status(400).json({message:"QR expired"});

 const record=await AttendanceRecord.create({
  sessionId:session._id,
  studentId:req.body.studentId,
  courseId:session.courseId
 });

 res.json(record);
};
