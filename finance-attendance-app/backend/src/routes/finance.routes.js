
import express from "express";
import {
 createPayment,
 pendingPayments,
 approvePayment,
 rejectPayment
} from "../controllers/finance.controller.js";

const router=express.Router();

router.post("/pay",createPayment);
router.get("/pending",pendingPayments);
router.patch("/approve/:id",approvePayment);
router.patch("/reject/:id",rejectPayment);

export default router;
