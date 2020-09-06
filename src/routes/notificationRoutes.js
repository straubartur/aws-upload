const express = require('express')
const notificationRoutes = express.Router()
const { notificationControllers } = require('../controllers/notificationControllers')

notificationRoutes.post('/', notificationControllers.notificate);
notificationRoutes.post('/mail', notificationControllers.mail);


module.exports = notificationRoutes;