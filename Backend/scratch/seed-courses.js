const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  shortDescription: String,
  price: { type: Number, required: true },
  fee: Number,
  instructor: String,
  image: String,
  rating: Number,
  reviews: Number,
  isBestseller: Boolean,
  category: String,
  level: String
}, { timestamps: true });

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

const MOCK_COURSES = [
  {
    title: "Complete Web Development Bootcamp",
    instructor: "Dr. Angela Yu",
    price: 19.99,
    fee: 19.99,
    description: "The most comprehensive web development course on the market.",
    rating: 4.8,
    reviews: 4503,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
    isBestseller: true,
    category: "Web Development",
    level: "Beginner"
  },
  {
    title: "Machine Learning A-Z™: AI, Python & R",
    instructor: "Kirill Eremenko",
    price: 24.99,
    fee: 24.99,
    description: "Learn Machine Learning with Python and R from scratch.",
    rating: 4.7,
    reviews: 3200,
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=250&fit=crop",
    isBestseller: true,
    category: "Data Science",
    level: "Intermediate"
  },
  {
    title: "Graphic Design Masterclass",
    instructor: "Lindsay Marsh",
    price: 14.99,
    fee: 14.99,
    description: "The Ultimate Guide to Graphic Design.",
    rating: 4.9,
    reviews: 2100,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
    isBestseller: false,
    category: "Design",
    level: "All Levels"
  },
  {
    title: "The Business Strategy Game",
    instructor: "Philip Kotler",
    price: 29.99,
    fee: 29.99,
    description: "Master the art of business strategy.",
    rating: 4.6,
    reviews: 1800,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
    isBestseller: true,
    category: "Business",
    level: "Advanced"
  },
  {
    title: "React & TypeScript — The Complete Guide",
    instructor: "Maximilian Schwarzmüller",
    price: 19.99,
    fee: 19.99,
    description: "Learn React and TypeScript to build modern web apps.",
    rating: 4.8,
    reviews: 3750,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
    isBestseller: true,
    category: "Web Development",
    level: "Intermediate"
  },
  {
    title: "UI/UX Design Bootcamp 2026",
    instructor: "Sarah Johnson",
    price: 22.99,
    fee: 22.99,
    description: "Become a professional UI/UX designer.",
    rating: 4.7,
    reviews: 1450,
    image: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=400&h=250&fit=crop",
    isBestseller: false,
    category: "Design",
    level: "Beginner"
  }
];

async function seed() {
  try {
    console.log('Connecting to local MongoDB...');
    await mongoose.connect('mongodb://127.0.0.1:27017/ITPM_LMS');
    
    console.log('Clearing existing courses...');
    await Course.deleteMany({});
    
    console.log('Seeding mock courses...');
    const createdCourses = await Course.insertMany(MOCK_COURSES);
    
    console.log('\n--- SEEDED COURSES (Mapping for Frontend) ---');
    createdCourses.forEach((c, index) => {
      console.log(`${index + 1}: ${c.title} -> ${c._id}`);
    });
    
    console.log('\nSeeding complete.');
  } catch (err) {
    console.error('Seeding failed:', err.message);
  } finally {
    await mongoose.connection.close();
  }
}

seed();
