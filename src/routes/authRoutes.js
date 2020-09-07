const express = require('express')
const authRoutes = express.Router()
const AuthController = require('../controllers/AuthControllers')

authRoutes.post('/login', AuthController.login);
authRoutes.post('/signup', AuthController.signUp);

module.exports = authRoutes;