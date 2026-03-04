import express from "express";
import { register, login, getProfile } from "../../controllers/Lasiru/authController.js";
import { authenticate, authorizeRoles } from "../../middleware/Lasiru/authMiddleware.js";

const router = express.Router();

// Public
router.post("/register", register);
router.post("/login", login);

// Authenticated only
router.get("/me", authenticate, getProfile);

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

export default router;

