require('dotenv').config()
const express = require('express')
const app = express()
const routes = require('./src/routes/routes')
const { knex } = require('./src/database/knex')
const jwt = require('jsonwebtoken')
const cors = require('cors')

const token = jwt.sign({
    id: 38,
    rId: 1
}, process.env.AUTH_CONFIG, { expiresIn: '6000000000000s' })

console.log(token)

app.use(express.json())
app.use(cors())
app.use(routes)

// app.get('/api/force-varzea', async (req, res) => {
//     const service = require('./src/services/PurchasesService')
//     const purchaseManager = require('./src/managers/purchase-manager')

//     const purchaseId = req.query.purchaseId || '88d10d26-b4e5-4b81-bcaf-1bd3ae37b277'
//     const PurchasesService = new service()

//     const purchase = await PurchasesService.findById(purchaseId)
//     const body = await purchaseManager.syncPurchasePosts(purchase)

//     res.send({
//         message: 'I S2 Straubers!',
//         data: {
//             purchaseId,
//             body,
//             purchase
//         }
//     })
// })

function startServer() {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server Online, port: ${port}`);
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
