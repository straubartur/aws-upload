require('dotenv').config()
const express = require('express')
const app = express()
const routes = require('./src/routes/routes')
// const factories = require('./test/factories/productFactory')
// require('./src/crons/resseler')
const jwt = require('jsonwebtoken')
// const busboy = require('connect-busboy');
// app.use(busboy());

const token = jwt.sign({
    id: 38,
    rId: 1
}, process.env.AUTH_CONFIG, { expiresIn: '6000000000000s' })

console.log(token)

//factories.populateDatabase();
app.use(express.json())

app.use(routes)

app.listen(3336, ()=>{
    console.log('Server Online, port: 3336')
})

