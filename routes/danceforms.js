const express = require('express');
const router = express.Router();
const danceFormsController = require('../controllers/danceFormsController');

/**
 * @swagger
 * /danceforms:
 *   get:
 *     tags: [DanceForms]
 *     summary: Get all dance styles and categories
 *     responses:
 *       200:
 *         description: List of dance forms (styles and categories)
 *       500:
 *         description: Server error
 */
router.get('/', danceFormsController.getAllDanceForms);

module.exports = router;