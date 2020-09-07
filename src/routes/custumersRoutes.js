const express = require('express')
const CustumersController = require('../controllers/CustumerControllers')
const authMiddleware = require('../middlewares/Auth')

const packageRoutes = express.Router()
packageRoutes.use(authMiddleware)

packageRoutes.get('/', CustumersController.getCustumers);
packageRoutes.get('/:id', CustumersController.getCustumers)
packageRoutes.post('/', CustumersController.createCustumer)
packageRoutes.put('/:id', CustumersController.updateCustumers)
packageRoutes.delete('/:id', CustumersController.deleteCustumer)

module.exports = packageRoutes;
