const express = require("express");
const {
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../../Controllers/Lasiru/announcementController");
const { authenticate, authorizeRoles } = require("../../middleware/Lasiru/authMiddleware");

const router = express.Router();

// Public routes (if any)
router.get("/", getAllAnnouncements);

// Protected routes
router.use(authenticate);
router.post("/", authorizeRoles("Admin"), createAnnouncement);
router.put("/:id", authorizeRoles("Admin"), updateAnnouncement);
router.delete("/:id", authorizeRoles("Admin"), deleteAnnouncement);

module.exports = router;
