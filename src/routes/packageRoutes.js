const express = require('express')
const PackagesController = require('../controllers/PackagesController')
const authMiddleware = require('../middlewares/Auth')

const packageRoutes = express.Router()
packageRoutes.use(authMiddleware)

packageRoutes.get('/', PackagesController.getPackages);
packageRoutes.get('/:id', PackagesController.getPackages)
packageRoutes.post('/', PackagesController.createPackage)
packageRoutes.put('/:id', PackagesController.updatePackage)
packageRoutes.delete('/:id', PackagesController.deletePackage)

module.exports = packageRoutes;
