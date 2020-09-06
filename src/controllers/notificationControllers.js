const knex = require('../database/knex');
const mail = require('../services/mail');

/**
 * Insert  status change into status road and notificates the clients
 * @param { String } operator who made the operation
 * @param { Integer } order wich order has changed
 * @param { Integer } status the new order state
 * @param { String} email email to send the email
 * @returns { Promise }  
 */
async function persistAndNotificate(operator, order, status, email) {
    return new Promise(async function (resolve, reject) {
        const operatorId = operator
        const orderId = order
        const statusId = status

        try {
            await knex('orderStatusRoad')
                .insert({
                    statusId,
                    operatorId,
                    orderId
                })
            
            const status = await knex('status')
                .select('*')
                .where('status_id', statusId)
            
            const orderEmail = email || await knex('orders')
                .join('customers', 'orders.customerId', '=', 'customers.customerId')
                .select('email', 'givenName')
                .first()

            await mail.sendMail({
                from: 'artur.straub@envolti.com.br', // sender address
                to: email,
                subject: `Oi Renato o status de seu pedido foi atualizado`,
                text: "Hello world?",
                });
            resolve ({
                orderEmail: orderEmail.email,
                status
            })
        } catch (error) {
            reject ({
                message: error
            })
        }
    })
}

class NotificationControllers {
    async notificate(req, res) {
        try {
            const {
                statusId,
                operatorId,
                orderId 
            } = req.body;
            const orderEmail = await persistAndNotificate(statusId, operatorId, orderId)

            res.status(201).json({
                data: {
                    ...orderEmail,
                    status: statusId,
                    message: 'email enviado com sucesso'
                }
            })
        } catch (error) {
            return res.status(500).json({
                message: error
            }) 
        }
    }

    async mail(req, res) {
        try {
            const {
                destination,
                subject,
                text,
                html
            } = req.body;
            await mail.sendMail({
                from: 'artur.straub@envolti.com.br', // sender address
                to: destination,
                subject,
                text,
                ...html && { html }
                });

            res.status(201).json({
                data: {
                    message: 'email enviado com sucesso'
                }
            })
        } catch (error) {
            return res.status(500).json({
                message: error
            }) 
        }
    }
}   

module.exports = {
    notificationControllers: new NotificationControllers(),
    persistAndNotificate
};