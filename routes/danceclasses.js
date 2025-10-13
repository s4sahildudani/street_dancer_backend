const express = require('express');
const router = express.Router();
const danceClassesController = require('../controllers/danceClassesController');

/**
 * @swagger
 * /danceclasses:
 *   post:
 *     summary: Add a dance class
 *     tags: [DanceClasses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - city
 *               - instructor
 *               - style
 *             properties:
 *               name:
 *                 type: string
 *                 example: Hip Hop Beginners
 *               city:
 *                 type: string
 *                 example: Mumbai
 *               instructor:
 *                 type: string
 *                 example: John Doe
 *               style:
 *                 type: string
 *                 example: Hip Hop
 *     responses:
 *       200:
 *         description: Dance class added successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', danceClassesController.addDanceClass);

/**
 * @swagger
 * /danceclasses:
 *   get:
 *     summary: Get dance classes by city
 *     tags: [DanceClasses]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         required: true
 *         description: City name to filter dance classes
 *     responses:
 *       200:
 *         description: List of dance classes in the city
 *       400:
 *         description: City is required
 *       500:
 *         description: Server error
 */
router.get('/', danceClassesController.getDanceClassesByCity);

module.exports = router;