// Reviews handling

const Review = require('../../models/sadeepa/Review.js');

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.postReview = async (req, res) => {
  try {
    const { studentName, rating, comment } = req.body;
    
    if (!studentName || !rating || !comment) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const newReview = new Review({
      studentName,
      rating,
      comment
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.replyReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminReply } = req.body;

    if (!adminReply) {
      return res.status(400).json({ message: 'Reply content is required' });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { adminReply },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
