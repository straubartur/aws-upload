const express = require('express')
const authRoutes = express.Router()
const AuthController = require('../controllers/AuthControllers')
const authMiddleware = require('../middlewares/Auth')

authRoutes.post('/login', AuthController.login);
authRoutes.post('/signup', authMiddleware, AuthController.signUp);

module.exports = authRoutes;
