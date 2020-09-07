const cron = require("node-cron");
const knex = require('../database/knex');
const axios = require('axios');

const PURCHASE_DETAIL_URL = 'https://api.awsli.com.br/v1/pedido/pedido_id='


/**
 * get the current time and convert date to iso string
 * @param { Number } daysBehind number of max of days to go back
 * @returns { String } date
 */
function getPastDate(daysBehind) {
    const datetime = new Date();
    datetime.setDate(datetime.getDay() - daysBehind);
    const date = datetime.toISOString()
    return date
}


/**
 * Cron configured to run every 30 minutes
 */
cron.schedule("*/30 * * * *", async () => {
    const unpaidPurchases = await knex('Purchases')
        .where('orders.createdAt', '>', getPastDate(5))
        .where('is_paid', false)
        .select('*')


    for (let i = 0; i < unpaidPurchases.length; i++) {
        try {
            const { pagamentos = [] } = await axios
                .get(`${PURCHASE_DETAIL_URL}${unpaidPurchases[i].loja_integrada_purchase_id}`, {
                    headers: {
                        'Content-Type': 'application/json' 
                    }
                })

            const isPaid = pagamentos
            await knex('Purchases')
                .update({
                    is_paid: isPaid,
                })
                .where({
                    loja_integrada_purchase_id: npaidPurchases[i].loja_integrada_purchase_id
                })
        } catch (error) {
            continue
        }
    }
}, {
    scheduled: true,
    timezone: 'America/Sao_Paulo'
  });