const StudentProject = require('../../models/sadeepa/StudentProject');

exports.uploadProject = async (req, res) => {
  try {
    const { title, description, author, category, uploadDate, languages, fileData } = req.body;
    
    const newProject = new StudentProject({
      title,
      description,
      author,
      category,
      uploadDate,
      languages,
      fileData
    });

    await newProject.save();
    res.status(201).json({ message: 'Project uploaded successfully', project: newProject });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload project', error: error.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await StudentProject.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch projects', error: error.message });
  }
};

exports.incrementViews = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await StudentProject.findByIdAndUpdate(id, { $inc: { viewsCount: 1 } }, { new: true });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Failed to increment views', error: error.message });
  }
};

exports.incrementDownloads = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await StudentProject.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } }, { new: true });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Failed to increment downloads', error: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await StudentProject.findByIdAndDelete(id);
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete project', error: error.message });
  }
};
