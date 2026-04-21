const mongoose = require('mongoose');

const studentProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  uploadDate: { type: String, required: true },
  viewsCount: { type: Number, default: 0 },
  downloadCount: { type: Number, default: 0 },
  languages: [{ type: String }],
  fileData: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.models.sadeepa_StudentProject || mongoose.model('sadeepa_StudentProject', studentProjectSchema);
