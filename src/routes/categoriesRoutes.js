const express = require('express')
const categoriesRoutes = express.Router()
const CategoriesController = require('../controllers/CategoriesControllers')
const authMiddleware = require('../middlewares/Auth')

// categoriesRoutes.use(authMiddleware)

categoriesRoutes.get('/', CategoriesController.getCategories);
categoriesRoutes.get('/:id', CategoriesController.getCategoryById)
categoriesRoutes.put('/:id', CategoriesController.updateCategory)
categoriesRoutes.delete('/:id', CategoriesController.deleteCategory)
categoriesRoutes.post('/', CategoriesController.createCategory)

module.exports = categoriesRoutes;
