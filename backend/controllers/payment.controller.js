const Payment = require('../models/Payment');
const Course = require('../models/Course');

exports.createPayment = async (req, res) => {
  try {
    const { studentId, courseId, method } = req.body;

    if (!studentId || !courseId || !method) {
      return res.status(400).json({
        message: 'Student ID, course, and payment method are required',
      });
    }

    if (!/^IT\d{4,}$/.test(studentId)) {
      return res.status(400).json({
        message: 'Invalid student ID format',
      });
    }

    if (!['CARD', 'BANK_TRANSFER'].includes(method)) {
      return res.status(400).json({
        message: 'Invalid payment method',
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
      });
    }

    const payment = await Payment.create({
      studentId,
      course: courseId,
      amount: course.fee || 0,
      method,
      status: 'PENDING',
    });

    res.status(201).json({
      message: 'Payment created successfully',
      payment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('course');
    res.json(payments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getPaymentByStudent = async (req, res) => {
  try {
    const payments = await Payment.find({
      studentId: req.params.studentId,
    }).populate('course');

    res.json(payments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.approvePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: 'APPROVED' },
      { new: true }
    ).populate('course');

    if (!payment) {
      return res.status(404).json({
        message: 'Payment not found',
      });
    }

    res.json({
      message: 'Payment approved',
      payment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.rejectPayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: 'REJECTED' },
      { new: true }
    ).populate('course');

    if (!payment) {
      return res.status(404).json({
        message: 'Payment not found',
      });
    }

    res.json({
      message: 'Payment rejected',
      payment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);

    if (!payment) {
      return res.status(404).json({
        message: 'Payment not found',
      });
    }

    res.json({
      message: 'Payment deleted successfully',
      payment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};