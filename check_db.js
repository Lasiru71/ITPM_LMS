import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './backend/models/Lasiru/User.js';

dotenv.config({ path: './backend/.env' });

async function checkCounts() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const studentCount = await User.countDocuments({ role: 'Student' });
        const lecturerCount = await User.countDocuments({ role: 'Lecturer' });
        const totalCount = await User.countDocuments();

        console.log('Student Count:', studentCount);
        console.log('Lecturer Count:', lecturerCount);
        console.log('Total User Count:', totalCount);

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkCounts();
