const express = require('express')
const packageRoutes = express.Router()
const PackagesController = require('../controllers/PackagesController')
const authMiddleware = require('../middlewares/Auth')

packageRoutes.use(authMiddleware)

packageRoutes.get('/', PackagesController.getPackages);
packageRoutes.get('/:id', PackagesController.getPackages)
packageRoutes.post('/', PackagesController.createPackage)
packageRoutes.put('/:id', PackagesController.updatePackage)
packageRoutes.delete('/:id', PackagesController.deletePackage)
packageRoutes.post('/publish/:id', PackagesController.publishPackage)

module.exports = packageRoutes;
