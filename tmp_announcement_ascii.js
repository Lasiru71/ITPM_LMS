import Announcement from "../../models/Lasiru/Announcement.js";

// @desc    Get all announcements (Admin view)
// @route   GET /api/announcements
export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get role-based notifications (Latest 5 for popup)
// @route   GET /api/announcements/notifications/latest
export const getLatestNotifications = async (req, res) => {
  const { role } = req.query; // role: Student, Lecture, Admin
  let filter = {};

  if (role === "Student") {
    filter = { toWhom: { $in: ["Student", "All"] } };
  } else if (role === "Lecture" || role === "Lecturer") {
    filter = { toWhom: { $in: ["Lecture", "All"] } };
  } else if (role === "Admin") {
    filter = {}; // All
  }

  try {
    const notifications = await Announcement.find(filter)
      .sort({ createdAt: -1 })
      .limit(5);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all notifications with pagination (Full page)
// @route   GET /api/announcements/notifications/all
export const getPaginatedNotifications = async (req, res) => {
  const { role, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  let filter = {};

  if (role === "Student") {
    filter = { toWhom: { $in: ["Student", "All"] } };
  } else if (role === "Lecture" || role === "Lecturer") {
    filter = { toWhom: { $in: ["Lecture", "All"] } };
  } else if (role === "Admin") {
    filter = {}; // All
  }

  try {
    const total = await Announcement.countDocuments(filter);
    const notifications = await Announcement.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      notifications,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an announcement
// @route   POST /api/announcements
export const createAnnouncement = async (req, res) => {
  const { title, description, toWhom, category, priority } = req.body;

  try {
    const newAnnouncement = new Announcement({
      title,
      description,
      toWhom,
      category,
      priority,
    });
    await newAnnouncement.save();
    res.status(201).json(newAnnouncement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an announcement
// @route   PUT /api/announcements/:id
export const updateAnnouncement = async (req, res) => {
  const { id } = req.params;
  const { title, description, toWhom, category, priority, isActive } = req.body;

  try {
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      id,
      { title, description, toWhom, category, priority, isActive },
      { new: true, runValidators: true }
    );
    if (!updatedAnnouncement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    res.status(200).json(updatedAnnouncement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
export const deleteAnnouncement = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAnnouncement = await Announcement.findByIdAndDelete(id);
    if (!deletedAnnouncement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
