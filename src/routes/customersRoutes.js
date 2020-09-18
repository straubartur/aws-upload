const express = require('express')
const CustomersController = require('../controllers/CustomersController')
const authMiddleware = require('../middlewares/Auth')

const customerRoutes = express.Router()
customerRoutes.use(authMiddleware)

customerRoutes.get('/', CustomersController.getCustumers);
customerRoutes.get('/:id', CustomersController.getCustumers)
customerRoutes.post('/', CustomersController.createCustumer)
customerRoutes.put('/:id', CustomersController.updateCustumer)
customerRoutes.delete('/:id', CustomersController.deleteCustumer)

module.exports = customerRoutes;
