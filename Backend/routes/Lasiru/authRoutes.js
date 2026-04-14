const express = require("express");
const { register, login, getProfile, updateProfile, changePassword } = require("../../Controllers/Lasiru/authController.js");
const { authenticate, authorizeRoles } = require("../../middleware/Lasiru/authMiddleware.js");

const router = express.Router();

// Public
router.post("/register", register);
router.post("/login", login);

// Authenticated only
router.get("/me", authenticate, getProfile);
router.put("/update-profile", authenticate, updateProfile);
router.put("/change-password", authenticate, changePassword);

// Role-based example routes
router.get(
  "/student-only",
  authenticate,
  authorizeRoles("Student"),
  (req, res) => {
    res.json({ message: "Student content", user: req.user });
  }
);

router.get(
  "/lecturer-only",
  authenticate,
  authorizeRoles("Lecturer"),
  (req, res) => {
    res.json({ message: "Lecturer content", user: req.user });
  }
);

router.get(
  "/admin-only",
  authenticate,
  authorizeRoles("Admin"),
  (req, res) => {
    res.json({ message: "Admin content", user: req.user });
  }
);

module.exports = router;
