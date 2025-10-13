const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructorController');

/**
 * @swagger
 * /instructors:
 *   get:
 *     tags: [Instructors]
 *     summary: Get all instructors
 *     responses:
 *       200:
 *         description: List of instructors
 *       500:
 *         description: Server error
 */
router.get('/', instructorController.getAllInstructors);

module.exports = router;