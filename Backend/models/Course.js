const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  shortDescription: String,
  fee: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: Number,
  instructor: String,
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  image: String,
  rating: {
    type: Number,
    default: 0
  },
  reviews: {
    type: Number,
    default: 0
  },
  isBestseller: {
    type: Boolean,
    default: false
  },
  category: String,
  level: String,
}, { timestamps: true });

module.exports = mongoose.models.Course || mongoose.model('Course', courseSchema);