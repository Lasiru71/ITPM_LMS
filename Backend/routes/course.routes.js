const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

router.post("/", async (req, res) => {
  try {
    const { title, description, fee } = req.body;

    if (!title || fee === undefined || fee === null || fee === "") {
      return res.status(400).json({
        message: "Title and fee are required",
      });
    }

    if (isNaN(fee) || Number(fee) < 0) {
      return res.status(400).json({
        message: "Fee must be a valid positive number",
      });
    }

    const course = await Course.create({
      title,
      description,
      fee: Number(fee),
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/lecturer/:lecturerId", async (req, res) => {
  try {
    const courses = await Course.find({ instructorId: req.params.lecturerId });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;