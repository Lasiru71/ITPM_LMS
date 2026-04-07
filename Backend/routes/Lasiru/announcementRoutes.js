import express from "express";
import {
  getAllAnnouncements,
  getLatestNotifications,
  getPaginatedNotifications,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../../Controllers/Lasiru/announcementController.js";

const router = express.Router();

router.get("/", getAllAnnouncements);
router.get("/notifications/latest", getLatestNotifications);
router.get("/notifications/all", getPaginatedNotifications);
router.post("/", createAnnouncement);
router.put("/:id", updateAnnouncement);
router.delete("/:id", deleteAnnouncement);

export default router;
