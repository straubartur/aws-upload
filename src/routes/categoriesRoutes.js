const express = require('express')
const categoriesRoutes = express.Router()
const CategoriesController = require('../controllers/CategoriesControllers')
const authMiddleware = require('../middlewares/Auth')

categoriesRoutes.use(authMiddleware)

categoriesRoutes.get('/', CategoriesController.getCategory);
categoriesRoutes.get('/:id', CategoriesController.getCategory)
categoriesRoutes.put('/:id', CategoriesController.updateCategory)
categoriesRoutes.delete('/:id', CategoriesController.deleteCategory)
categoriesRoutes.post('/', CategoriesController.createCategory)

module.exports = categoriesRoutes;
