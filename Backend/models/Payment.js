const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
  },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  method: {
    type: String,
    enum: ['CARD', 'BANK_TRANSFER'],
    required: true,
  },

  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING',
  },

  // For bank transfer slip
  slipImage: {
    type: String,
    default: '',
  },

  // For card payment (SAFE info only)
  cardDetails: {
    cardName: {
      type: String,
      default: '',
    },
    cardLast4: {
      type: String,
      default: '',
    },
    expiry: {
      type: String,
      default: '',
    },
  },

  // Admin notes
  adminRemark: {
    type: String,
    default: '',
  },

}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);