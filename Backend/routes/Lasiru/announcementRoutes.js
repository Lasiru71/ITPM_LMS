const express = require("express");
const {
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getLatestNotifications,
  getPaginatedNotifications,
} = require("../../Controllers/Lasiru/announcementController.js");

const router = express.Router();

router.get("/", getAllAnnouncements);
router.post("/", createAnnouncement);
router.put("/:id", updateAnnouncement);
router.delete("/:id", deleteAnnouncement);

// Notification routes
router.get("/notifications/latest", getLatestNotifications);
router.get("/notifications/all", getPaginatedNotifications);

module.exports = router;
