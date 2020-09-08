const { Router } = require('express')
// const orderRoutes = require('./orderRoutes')
const packageRoutes = require('./packageRoutes')
const categoriesRoutes = require('./categoriesRoutes')
const custumersRoutes = require('./custumersRoutes')
const campaignsRoutes = require('./campaignsRoutes')
// const campaignsPostRoutes = require('./campaignsPostRoutes')
const authRoutes = require('./authRoutes')
const routes = Router()

// routes.use('/order', orderRoutes)
routes.use('/packages', packageRoutes)
routes.use('/categories', categoriesRoutes)
routes.use('/campaigns', campaignsRoutes)
// routes.use('/posts', campaignsPostRoutes)
routes.use('/auth', authRoutes)
routes.use('/custumers', custumersRoutes)


module.exports = routes;