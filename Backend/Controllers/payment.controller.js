const Payment = require("../models/Payment");
const Course = require("../models/Course");

exports.createPayment = async (req, res) => {
  try {
    const {
      studentId,
      courseId,
      method,
      cardName,
      cardNumber,
      expiry,
    } = req.body;

    if (!studentId || !courseId || !method) {
      return res.status(400).json({
        message: "Student ID, course, and payment method are required",
      });
    }

    if (!/^IT\d{4,}$/.test(studentId)) {
      return res.status(400).json({
        message: "Invalid student ID format",
      });
    }

    if (!["CARD", "BANK_TRANSFER"].includes(method)) {
      return res.status(400).json({
        message: "Invalid payment method",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    let slipImage = "";
    let safeCardDetails = {
      cardName: "",
      cardLast4: "",
      expiry: "",
    };

    if (method === "BANK_TRANSFER") {
      if (!req.file) {
        return res.status(400).json({
          message: "Bank payment slip is required for bank transfer",
        });
      }

      slipImage = `/uploads/${req.file.filename}`;
    }

    if (method === "CARD") {
      if (!cardName || !cardNumber || !expiry) {
        return res.status(400).json({
          message: "Card details are required for card payment",
        });
      }

      const cleanedCard = cardNumber.replace(/\s/g, "");

      safeCardDetails = {
        cardName,
        cardLast4: cleanedCard.slice(-4),
        expiry,
      };
    }

    const payment = await Payment.create({
      studentId,
      course: courseId,
      amount: course.price || 0,
      method,
      status: "PENDING",
      slipImage,
      cardDetails: safeCardDetails,
    });

    res.status(201).json({
      message: "Payment created successfully",
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
    const payments = await Payment.find().populate("course");
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
    }).populate("course");

    res.json(payments);
  } catch (error) {
    console.error("Error in getPaymentByStudent:", error);
    res.status(500).json({
      message: "Payment tracking failed: " + error.message,
    });
  }
};

exports.approvePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: "APPROVED" },
      { new: true }
    ).populate("course");

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    res.json({
      message: "Payment approved",
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
    const { adminRemark } = req.body;
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: "REJECTED", adminRemark: adminRemark || "" },
      { new: true }
    ).populate("course");

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    res.json({
      message: "Payment rejected",
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
        message: "Payment not found",
      });
    }

    res.json({
      message: "Payment deleted successfully",
      payment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};