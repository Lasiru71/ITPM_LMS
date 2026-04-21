const express = require('express');
const router = express.Router();
const reviewController = require('../../Controllers/Jeewani/reviewController');

router.post('/', reviewController.createReview);
router.get('/', reviewController.getAllReviews);

module.exports = router;
