const Material = require('../../models/sadeepa/Material.js');

exports.uploadMaterial = async (req, res) => {
  try {
    const { title, description, category, type, image, fileData } = req.body;
    
    const newMaterial = new Material({
      title,
      description,
      category,
      type,
      image,
      fileData
    });

    await newMaterial.save();
    res.status(201).json({ message: 'Material uploaded successfully', material: newMaterial });
  } catch (error) {
    console.error('Upload material error:', error);
    res.status(500).json({ message: 'Failed to upload material', error: error.message });
  }
};

exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find().sort({ createdAt: -1 });
    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch materials', error: error.message });
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    await Material.findByIdAndDelete(id);
    res.status(200).json({ message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete material', error: error.message });
  }
};
