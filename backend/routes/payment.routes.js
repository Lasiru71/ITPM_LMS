const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

router.post('/', paymentController.createPayment);
router.get('/', paymentController.getAllPayments);
router.get('/student/:studentId', paymentController.getPaymentByStudent);
router.put('/approve/:id', paymentController.approvePayment);
router.put('/reject/:id', paymentController.rejectPayment);

module.exports = router;