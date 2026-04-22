const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Student", "Lecturer", "Admin"], default: "Student" },
  studentId: { type: String, unique: true, sparse: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

const USERS = [
  {
    name: "Test Student",
    email: "teststudent@gmail.com",
    password: "Test123",
    role: "Student",
    studentId: "IT2023001"
  },
  {
    name: "Admin User",
    email: "admin@gmail.com",
    password: "Test123",
    role: "Admin"
  },
  {
    name: "Test Admin",
    email: "testadmin@gmail.com",
    password: "Test123",
    role: "Admin"
  },
  {
    name: "Test Lecturer",
    email: "lecturer@gmail.com",
    password: "Test123",
    role: "Lecturer"
  },
  {
    name: "New Lecturer",
    email: "test@gmail.com",
    password: "Test123",
    role: "Lecturer"
  }
];

async function seed() {
  try {
    console.log('Connecting to local MongoDB...');
    await mongoose.connect('mongodb://127.0.0.1:27017/ITPM_LMS');
    
    console.log('Clearing existing users...');
    await User.deleteMany({});
    
    console.log('Hashing passwords and seeding users...');
    for (const u of USERS) {
      const hashedPassword = await bcrypt.hash(u.password, 10);
      await User.create({
        ...u,
        password: hashedPassword,
        email: u.email.toLowerCase()
      });
      console.log(`Created: ${u.email} (${u.role})`);
    }
    
    console.log('\nSeeding complete.');
  } catch (err) {
    console.error('Seeding failed:', err.message);
  } finally {
    await mongoose.connection.close();
  }
}

seed();
