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

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Send OTP for signup
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               name:
 *                 type: string
 *                 example: John Doe
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
 *         description: OTP sent
 *       400:
 *         description: Email and password required
 *       500:
 *         description: Server error
 */
router.post('/signup', usersController.signup);

/**
 * @swagger
 * /users/verify:
 *   post:
 *     summary: Verify OTP and activate account
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Account verified successfully
 *       400:
 *         description: Invalid input or OTP
 *       500:
 *         description: Server error
 */
router.post('/verify', usersController.verifyOTP);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login user (only verified users allowed)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: mypassword123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Email and password required
 *       401:
 *         description: Invalid credentials or account not verified
 *       500:
 *         description: Server error
 */
router.post('/login', usersController.login);

module.exports = router;