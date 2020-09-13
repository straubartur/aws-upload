const { Router } = require('express')

const categoriesRoutes = require('./categoriesRoutes')
const packageRoutes = require('./packageRoutes')

const custumersRoutes = require('./custumersRoutes')
const authRoutes = require('./authRoutes')

const routes = Router()

routes.use('/categories', categoriesRoutes)
routes.use('/packages', packageRoutes)

routes.use('/auth', authRoutes)
routes.use('/custumers', custumersRoutes)

module.exports = routes;
