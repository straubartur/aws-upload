const {Router} = require('express')
const orderRoutes = require('./orderRoutes')
const categoriesRoutes = require('./categoriesRoutes')
const campaignsRoutes = require('./campaignsRoutes')
const campaignsPostRoutes = require('./campaignsPostRoutes')
const authRoutes = require('./authRoutes')
const routes = Router()

routes.use('/order', orderRoutes)
routes.use('/categories', categoriesRoutes)
routes.use('/campaigns', campaignsRoutes)
routes.use('/posts', campaignsPostRoutes)
routes.use('/auth', authRoutes)


module.exports = routes;