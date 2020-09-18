const { Router } = require('express')

const categoriesRoutes = require('./categoriesRoutes')
const packageRoutes = require('./packageRoutes')
const customersRoutes = require('./customersRoutes')

const authRoutes = require('./authRoutes')

const routes = Router()

routes.use('/auth', authRoutes)

routes.use('/api/categories', categoriesRoutes)
routes.use('/api/packages', packageRoutes)
routes.use('/api/customers', customersRoutes)

module.exports = routes;
