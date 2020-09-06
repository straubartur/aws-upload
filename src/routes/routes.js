const {Router} = require('express')
const orderRoutes = require('./orderRoutes')
const categoriesRoutes = require('./categoriesRoutes')
const routes = Router()

routes.use('/order', orderRoutes)
routes.use('/categories', categoriesRoutes)


module.exports = routes;