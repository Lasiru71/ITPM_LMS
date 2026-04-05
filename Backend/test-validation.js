import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import Course from './models/Jeewani/Course.js';

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const course = await Course.findOne();
  console.log('before remove desc', course.description);
  await Course.collection.updateOne({_id: course._id}, {$unset: {description: ""}});
  
  const doc = await Course.findById(course._id);
  console.log('doc desc after unset', doc.description);
  
  try {
    doc.modules.push({ title: 'testing validate false', lessons: [] });
    await doc.save({ validateBeforeSave: false });
    console.log('Saved successfully even without description!');
  } catch (err) {
    console.log('Failed!', err.message);
  }
  process.exit();
}
main();
