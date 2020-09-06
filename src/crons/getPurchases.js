const cron = require("node-cron");
const knex = require('../database/knex');
const { persistAndNotificate } = require('../controllers/notificationControllers');

/**
 * get the current time and convert to maria db format
 * @param { Number } hoursToValidade number of max hours to 
 * @returns { String } date
 */
function getChangeTime(hoursToValidade) {
    const datetime = new Date();
    datetime.setHours(datetime.getHours() - hoursToValidade);
    const date = datetime.toISOString()
    return date
}


/**
 * Cron configured to run every 5 minutes
 * from 10 to 17
 */
cron.schedule("*/5 10-17 * * *", async () => {
    const orders = await knex('orders')
        .where('orders.createdAt', '<', getChangeTime(2))
        .join('orderForm', 'orders.orderFormId', '=', 'orderForm.orderToken')
        .andWhere('status_id', waitingApprovalStatus)
        .andWhereNot('reseller_id', intelbrasResellerId)
        .select('*')

    const orderFormTokens = orders.map(order => order.orderFormId)

    await knex('orderForm')
        .update({
            reseller_id: intelbrasResellerId,
            status_id: 6
        })
        .whereIn(
            'orderToken', orderFormTokens
        )
    
    for (let i = 0; i < orders.length; i++) {
        await persistAndNotificate(
            'Cron time automated process',
            orders[i].orders_id,
            notAprovedStatus,
            intel
        )
        await knex('orderStatusRoad')
            .insert({
                orderId: orders[i].orders_id,
                statusId: 6,
                operatorId: 'Cron time automated process',
            })
    }
}, {
    scheduled: true,
    timezone: 'America/Sao_Paulo'
  });