const { Router } = require('express')

const categoriesRoutes = require('./categoriesRoutes')
const packageRoutes = require('./packageRoutes')

const custumersRoutes = require('./custumersRoutes')
const authRoutes = require('./authRoutes')

const routes = Router()

routes.use('/auth', authRoutes)

routes.use('/api/categories', categoriesRoutes)
routes.use('/api/packages', packageRoutes)
routes.use('/api/custumers', custumersRoutes)

module.exports = routes;
