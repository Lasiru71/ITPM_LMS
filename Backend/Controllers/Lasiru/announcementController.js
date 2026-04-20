const Announcement = require("../../models/Lasiru/Announcement");

// @desc    Get all announcements
// @route   GET /api/announcements
exports.getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an announcement
// @route   POST /api/announcements
exports.createAnnouncement = async (req, res) => {
  const { title, content, category, priority, toWhom } = req.body;

  try {
    const newAnnouncement = new Announcement({
      title,
      content,
      category,
      priority,
      toWhom,
    });
    await newAnnouncement.save();
    res.status(201).json(newAnnouncement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an announcement
// @route   PUT /api/announcements/:id
exports.updateAnnouncement = async (req, res) => {
  const { id } = req.params;
  const { title, content, category, priority, isActive, toWhom } = req.body;

  try {
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      id,
      { title, content, category, priority, isActive, toWhom },
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
exports.deleteAnnouncement = async (req, res) => {
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
// @desc    Get latest 5 notifications by role
// @route   GET /api/announcements/notifications/latest?role=Lecturer
exports.getLatestNotifications = async (req, res) => {
  const { role } = req.query;
  try {
    // Map role to the plural toWhom value stored in the DB
    const roleToWhom = role === "Lecturer" ? "Lecturers"
      : role === "Student" ? "Students"
        : null;
    const filter = roleToWhom
      ? { toWhom: { $in: [roleToWhom, "All"] }, isActive: { $ne: false } }
      : { isActive: { $ne: false } };
    const notifications = await Announcement.find(filter)
      .sort({ createdAt: -1 })
      .limit(5);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get paginated notifications by role
// @route   GET /api/announcements/notifications/all?role=Lecturer&page=1&limit=10
exports.getPaginatedNotifications = async (req, res) => {
  const { role } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  try {
    const roleToWhom = role === "Lecturer" ? "Lecturers"
      : role === "Student" ? "Students"
        : null;
    const filter = roleToWhom
      ? { toWhom: { $in: [roleToWhom, "All"] }, isActive: { $ne: false } }
      : { isActive: { $ne: false } };
    const total = await Announcement.countDocuments(filter);
    const notifications = await Announcement.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.status(200).json({
      notifications,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
