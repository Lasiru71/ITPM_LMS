import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Course from './models/Jeewani/Course.js';

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('connected');
  const courses = await Course.find({ title: /Introduction to Business/i });
  for (const course of courses) {
    console.log('course id', course._id, 'title:', course.title);
    try {
      course.updatedAt = new Date();
      await course.save();
      console.log('saved successfully');
    } catch (err) {
      console.error('Save error:', err.message);
    }
  }
  mongoose.disconnect();
}
main();
