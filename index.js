require('dotenv').config()
const express = require('express')
const app = express()
const routes = require('./src/routes/routes')
const knex = require('./src/database/knex')
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
/*
knex.migrate.rollback(null, true)
    .then(() => {
        console.log('Rollback finalizado!');
    }).catch(err => {
        console.error('Fudeu!!!!! ---------------------------');
        console.error(err.message);
    });
*/

function startServer() {
    app.listen(3336, ()=>{
        console.log('Server Online, port: 3336');
    });
}

knex.migrate.latest()
    .then(() => {
        console.log('Migration finished!');
        startServer();
    })
    .catch(err => {
        console.error('--------------------------- Fudeu!!!');
        console.error(err.message);

        console.error('--------------------------- Rollback!!!');
        knex.migrate.rollback();
    });
