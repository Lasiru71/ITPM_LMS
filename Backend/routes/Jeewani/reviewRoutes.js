import express from 'express';
const router = express.Router();
import * as reviewController from '../../controllers/Jeewani/reviewController.js';

router.post('/', reviewController.createReview);
router.get('/', reviewController.getAllReviews);

export default router;
