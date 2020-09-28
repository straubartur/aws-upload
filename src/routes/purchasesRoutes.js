const express = require('express')
const purchasesRoutes = express.Router()
const PurchasesController = require('../controllers/PurchasesController')
const authMiddleware = require('../middlewares/Auth')

purchasesRoutes.get('/gallery/:id', PurchasesController.getGallery);
purchasesRoutes.get('/generate-logo-url', PurchasesController.generateLogoUrl);
purchasesRoutes.post('/new', PurchasesController.createPurchaseWithLogo);

purchasesRoutes.use(authMiddleware)

purchasesRoutes.get('/', PurchasesController.getPurchases);
purchasesRoutes.get('/:id', PurchasesController.getPurchaseById);
purchasesRoutes.post('/', PurchasesController.createPurchases);
purchasesRoutes.put('/:id', PurchasesController.updatePurchases);
purchasesRoutes.delete('/:id', PurchasesController.deletePurchases);

module.exports = purchasesRoutes;
