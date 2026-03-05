import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/Lasiru/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const register = async (req, res) => {
  try {
    const { name, address, phone, email, password, role, studentId } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    const effectiveRole = role && role.trim() ? role.trim() : "Student";
    if (!["Student", "Lecturer", "Admin"].includes(effectiveRole)) {
      return res
        .status(400)
        .json({ message: "Role must be Student, Lecturer, or Admin" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUserPayload = {
      name: name.trim(),
      address: address?.trim() || "",
      phone: phone?.trim() || "",
      email: email.toLowerCase(),
      password: hashedPassword,
      role: effectiveRole,
    };

    if (effectiveRole === "Student" && studentId && studentId.trim()) {
      newUserPayload.studentId = studentId.trim();
    }

    const user = await User.create(newUserPayload);

    const token = generateToken(user);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        address: user.address,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account is deactivated. Please contact admin." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    return res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        address: user.address,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getProfile = async (req, res) => {
  return res.json({ user: req.user });
};

