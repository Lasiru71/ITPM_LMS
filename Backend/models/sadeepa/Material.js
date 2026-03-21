import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, enum: ['Book', 'PDF', 'Document'], required: true },
  uploadDate: { type: Date, default: Date.now },
  downloads: { type: Number, default: 0 },
  image: { type: String }, // Base64 or URL
  fileData: { type: String, required: true } // Base64 or URL
}, { timestamps: true });

const Material = mongoose.model('sadeepa_Material', materialSchema);

export default Material;
