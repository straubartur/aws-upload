const express = require('express')
const packageRoutes = express.Router()
const PackagesController = require('../controllers/PackagesController')
const authMiddleware = require('../middlewares/Auth')

packageRoutes.use(authMiddleware)

packageRoutes.get('/', PackagesController.getPackages);
packageRoutes.get('/:id', PackagesController.getPackageById)
packageRoutes.post('/', PackagesController.savePackage)
packageRoutes.delete('/:id', PackagesController.deletePackage)
packageRoutes.post('/publish/:id', PackagesController.publishPackage)

packageRoutes.post('/generate-urls', PackagesController.generateUrls);

module.exports = packageRoutes;
