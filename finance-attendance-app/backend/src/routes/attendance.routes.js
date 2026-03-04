
import express from "express";
import {
 createSession,
 markAttendance
} from "../controllers/attendance.controller.js";

const router=express.Router();

router.post("/create-session",createSession);
router.post("/mark",markAttendance);

export default router;
