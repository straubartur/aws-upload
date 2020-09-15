const express = require('express')
const packageRoutes = express.Router()
const PackagesController = require('../controllers/PackagesController')
const PackagePostsController = require('../controllers/PackagePostsController')
const authMiddleware = require('../middlewares/Auth')

packageRoutes.use(authMiddleware)

packageRoutes.get('/', PackagesController.getPackages);
packageRoutes.get('/:id', PackagesController.getPackages)
packageRoutes.post('/', PackagesController.createPackage)
packageRoutes.put('/:id', PackagesController.updatePackage)
packageRoutes.delete('/:id', PackagesController.deletePackage)
packageRoutes.post('/publish/:id', PackagesController.publishPackage)

packageRoutes.get('/:packageId/posts', PackagePostsController.getPosts);
packageRoutes.get('/:packageId/posts/:id', PackagePostsController.getPosts)
packageRoutes.post('/:packageId/posts', PackagePostsController.createPosts)
packageRoutes.delete('/:packageId/posts/:id', PackagePostsController.deletePost)

packageRoutes.get('/:packageId/generate-urls/:quantity', PackagePostsController.generateUrls);

module.exports = packageRoutes;
