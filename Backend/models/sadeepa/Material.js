const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, enum: ['Book', 'PDF', 'Document'], required: true },
  uploadDate: { type: Date, default: Date.now },
  downloads: { type: Number, default: 0 },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String }, // Base64 or URL
  fileData: { type: String, required: true } // Base64 or URL
}, { timestamps: true });


module.exports = mongoose.models.sadeepa_Material || mongoose.model('sadeepa_Material', materialSchema);
