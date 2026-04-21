const Material = require('../../models/sadeepa/Material');

exports.uploadMaterial = async (req, res) => {
  try {
    const { title, description, category, type, image, fileData } = req.body;
    
    const newMaterial = new Material({
      title,
      description,
      category,
      type,
      image,
      fileData,
      instructorId: req.user._id // Set from authenticated user
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
    // Only fetch materials for the logged in lecturer
    const materials = await Material.find({ instructorId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch materials', error: error.message });
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check ownership
    const material = await Material.findById(id);
    if (!material) return res.status(404).json({ message: 'Material not found' });
    
    if (String(material.instructorId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden: You do not own this material' });
    }

    await Material.findByIdAndDelete(id);
    res.status(200).json({ message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete material', error: error.message });
  }
};
