const express = require("express");
const {
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getLatestNotifications,
  getPaginatedNotifications,
} = require("../../Controllers/Lasiru/announcementController");
const { authenticate, authorizeRoles } = require("../../middleware/Lasiru/authMiddleware");

const router = express.Router();

// Notification routes (must come before /:id to avoid collision)
router.get("/notifications/latest", authenticate, getLatestNotifications);
router.get("/notifications/all", authenticate, getPaginatedNotifications);

// Public routes (if any)
router.get("/", getAllAnnouncements);

// Protected routes
router.use(authenticate);
router.post("/", authorizeRoles("Admin"), createAnnouncement);
router.put("/:id", authorizeRoles("Admin"), updateAnnouncement);
router.delete("/:id", authorizeRoles("Admin"), deleteAnnouncement);

module.exports = router;
