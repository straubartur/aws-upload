const {Router} = require('express')
const orderRoutes = require('./orderRoutes')
const categoriesRoutes = require('./categoriesRoutes')
const authRoutes = require('./authRoutes')
const routes = Router()

routes.use('/order', orderRoutes)
routes.use('/categories', categoriesRoutes)
routes.use('/auth', authRoutes)


module.exports = routes;