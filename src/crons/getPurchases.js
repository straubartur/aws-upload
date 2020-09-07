const cron = require("node-cron");
const knex = require('../database/knex');
const axios = require('axios');


const PURCHASES_URL = 'https://api.awsli.com.br/v1/pedido/search/?'
const PURCHASE_DETAIL_URL = 'https://api.awsli.com.br/v1/pedido/pedido_id='
/**
 * Cron configured to run every 20 minutes
 */
cron.schedule("*/20 * * * *", async () => {
    const lastPurchase = await knex('Purchases')
        .orderBy('id', 'desc')
        .first()


    const newPurchases = await axios.get(`${PURCHASES_URL}since_numero=${lastPurchase}`, {
        headers: {
            'Content-Type': 'application/json' 
        }
    })
    
    for (let i = 0; i < newPurchases.length; i++) {
        try {
            let custumerId

            const { cliente = {}, itens } = await axios
                .get(`${PURCHASE_DETAIL_URL}${newPurchases[i].numero}`, {
                    headers: {
                        'Content-Type': 'application/json' 
                    }
                })

            const custumer = await knex('Customers')
                .where({
                    loja_integrada_id:  newPurchases[i].numero
                })
                .first();

            if (custumer && custumer.id) {
                await knex('Customers')
                    .update({
                        name: cliente.nome,
                        email: cliente.email,
                        phone: cliente.telefone_celular
                    })
                    .where({
                        loja_integrada_purchase_id: newPurchases[i].numero
                    })
            } else {
                [custumerId] = await knex('Customers')
                    .create({
                        name: cliente.nome,
                        email: cliente.email,
                        phone: cliente.telefone_celular,
                        loja_integrada_purchase_id: newPurchases[i].numero
                    })
            }
            
            const sku = itens && itens[0] && itens[0].sku;
            
            await knex('Purchases')
                .insert({
                    is_paid: false,
                    loja_integrada_id: newPurchases[i].numero,
                    customer_id: custumer && custumer.id || custumerId,
                    package_id: sku
                })
        } catch (error) {
            continue
        }
    }
}, {
    scheduled: true,
    timezone: 'America/Sao_Paulo'
  });