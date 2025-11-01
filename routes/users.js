const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of users
 *       500:
 *         description: Server error
 */
router.get('/', usersController.getAllUsers);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Add a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - password
 *               - confirmPassword
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: "1234567890"
 *               password:
 *                 type: string
 *                 example: mypassword123
 *               confirmPassword:
 *                 type: string
 *                 example: mypassword123
 *     responses:
 *       200:
 *         description: User added successfully
 *       400:
 *         description: Passwords do not match or invalid input
 *       500:
 *         description: Server error
 */
router.post('/', usersController.addUser);

module.exports = router;