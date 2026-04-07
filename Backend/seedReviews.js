import mongoose from 'mongoose';
import Review from './models/Lasiru/Review.js';
import User from './models/Lasiru/User.js';
import Course from './models/Jeewani/Course.js';
import { MONGO_URI } from './config.js';

async function seedReviews() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const students = await User.find({ role: 'Student' }).limit(2);
    const courses = await Course.find().limit(2);

    if (students.length === 0 || courses.length === 0) {
      console.log('Please ensure you have at least one student and one course in the database.');
      process.exit(0);
    }

    const mockReviews = [
      {
        courseId: courses[0]._id,
        studentId: students[0]._id,
        rating: 5,
        comment: 'Excellent course! Highly recommended for beginners.',
        status: 'Approved'
      },
      {
        courseId: courses[1]._id || courses[0]._id,
        studentId: students[1]._id || students[0]._id,
        rating: 4,
        comment: 'Very informative, but some parts are a bit fast.',
        status: 'Pending'
      }
    ];

    await Review.insertMany(mockReviews);
    console.log('Mock reviews seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding reviews:', error);
    process.exit(1);
  }
}

seedReviews();
