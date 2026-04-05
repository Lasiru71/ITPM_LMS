import mongoose from 'mongoose';
import Course from './models/Jeewani/Course.js';
import { MONGO_URI } from './config.js';

async function seedCourses() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const courses = [
            {
                title: "Introduction to React.js",
                description: "Learn the basics of React.js including components, props, and state.",
                category: "Web Development",
                price: 49.99,
                instructor: "Dr. Jeewani",
                level: "Beginner",
                status: "published"
            },
            {
                title: "Advanced Node.js Patterns",
                description: "Deep dive into Node.js architecture, streams, and performance optimization.",
                category: "Backend Development",
                price: 79.99,
                instructor: "Prof. Lasiru",
                level: "Advanced",
                status: "published"
            },
            {
                title: "UI/UX Design Essentials",
                description: "Master Figma and design principles to create stunning user interfaces.",
                category: "Design",
                price: 59.99,
                instructor: "Sadeepa Gunawardena",
                level: "Intermediate",
                status: "published"
            },
            {
                title: "Database Management with MongoDB",
                description: "Learn NoSQL database design and aggregation frameworks.",
                category: "Data Science",
                price: 69.99,
                instructor: "Jeewani K.",
                level: "Intermediate",
                status: "published"
            }
        ];

        // Only add if count is 0 to avoid duplicates
        const count = await Course.countDocuments();
        if (count === 0) {
            await Course.insertMany(courses);
            console.log('Courses seeded successfully!');
        } else {
            console.log('Courses already exist in the database.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error seeding courses:', error);
        process.exit(1);
    }
}

seedCourses();
