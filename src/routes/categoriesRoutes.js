const express = require('express')
const categoriesRoutes = express.Router()
const CategoriesController = require('../controllers/CategoriesControllers')
const authMiddleware = require('../middlewares/Auth')

categoriesRoutes.use(authMiddleware)

categoriesRoutes.get('/', CategoriesController.getCategories);
categoriesRoutes.get('/:id', CategoriesController.getCategories)
categoriesRoutes.put('/:id', CategoriesController.updateCategories)
categoriesRoutes.delete('/:id', CategoriesController.deleteCategories)
categoriesRoutes.post('/', CategoriesController.createCategories)

module.exports = categoriesRoutes;
