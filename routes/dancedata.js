const express = require('express');
const router = express.Router();
const dancedataController = require('../controllers/dancedataController');

/**
 * @swagger
 * /dancedata:
 *   get:
 *     tags: [DanceData]
 *     summary: Get all dance data
 *     responses:
 *       200:
 *         description: List of dance data
 *       500:
 *         description: Server error
 */
router.get('/', dancedataController.getAllDanceData);

/**
 * @swagger
 * /dancedata:
 *   post:
 *     summary: Add dance data
 *     tags: [DanceData]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Hip Hop Shoes
 *               price:
 *                 type: number
 *                 example: 499.99
 *     responses:
 *       200:
 *         description: Product added successfully
 *       500:
 *         description: Server error
 */
router.post('/', dancedataController.addDanceData);

module.exports = router;