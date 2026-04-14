import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env' });

async function checkCounts() {
    try {
        console.log('Connecting to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const usersCol = db.collection('users');

        const studentCount = await usersCol.countDocuments({ role: 'Student' });
        const lecturerCount = await usersCol.countDocuments({ role: 'Lecturer' });
        const totalCount = await usersCol.countDocuments();
        const activeCount = await usersCol.countDocuments({ isActive: true });

        console.log('--- DATABASE STATS ---');
        console.log('Student Count:', studentCount);
        console.log('Lecturer Count:', lecturerCount);
        console.log('Active Count:', activeCount);
        console.log('Total Count:', totalCount);

        const sampleUser = await usersCol.findOne({});
        console.log('Sample User:', JSON.stringify(sampleUser, null, 2));

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkCounts();
