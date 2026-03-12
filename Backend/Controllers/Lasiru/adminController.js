import User from "../../models/Lasiru/User.js";
import bcrypt from "bcrypt";

// --- Lecturer Management ---

// Get all lecturers
export const getAllLecturers = async (req, res) => {
    try {
        const lecturers = await User.find({ role: "Lecturer" }).select("-password");
        res.status(200).json(lecturers);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Create a new lecturer (Admin only)
export const createLecturer = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newLecturer = new User({
            name,
            email,
            password: hashedPassword,
            address,
            phone,
            role: "Lecturer",
            studentId: undefined, // Explicitly undefined to avoid indexing null/empty strings
        });

        await newLecturer.save();
        res.status(201).json({ message: "Lecturer created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete a lecturer
export const deleteLecturer = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "Lecturer deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// --- Student Management ---

// Get all students
export const getAllStudents = async (req, res) => {
    try {
        const students = await User.find({ role: "Student" }).select("-password");
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete a student
export const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// --- Common ---

// Toggle User Status (Activate/Deactivate)
export const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.status(200).json({
            message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
            isActive: user.isActive,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
