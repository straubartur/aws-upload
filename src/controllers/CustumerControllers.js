const knex = require('../database/knex')

class CategoriesControllers {
    async getCustumers (req, res) {
        const { id } = req.params
        const { date, limit, page } = req.query;
        try {
            const limitNumber = Number(limit || '10');
            const pageNumber = Number(page || '1');
            const offset = (pageNumber - 1) * limitNumber

            const model = () => knex('Customers')
                .where((queryBuilder) => {
                    if (date) {
                        queryBuilder.where('Customers.createdAt', '>=', date)
                    }
                    if(id) {
                        queryBuilder.where('id', id) 
                    }
                })


            const custumers = await model()
                    .limit(limitNumber)
                    .offset(offset)
                    .select('*')


            const custumersCount = await model()
                .count();
    
            const custumersCountN = custumersCount[0]
                && custumersCount[0]['count(*)']
        
            const paginate = [{
                'page': pageNumber, 
                'itensFound' : custumersCountN,
                'totalPages': Math.ceil(custumersCountN / limitNumber)
            }]

            return res.status(200).json({
                data: custumers,
                paginate
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error
            }) 
        }
    }

    async updateCustumers (req, res) {
        try {
            const { id } = req.params;
            const {
                name,
                email,
                customName,
                customPhone,
                rank,
                phone
            } = req.body;

            console.log(req.params, orderId)

            await knex('Custumers')
                .where('id', id)
                .update({
                    ...name && {
                        name
                    },
                    ...email && {
                        email
                    },
                    ...customName && {
                        custon_name: customName
                    },
                    ...customPhone && {
                        custom_phone: customPhone
                    },
                    ...rank && {
                        rank
                    },
                    ...phone && {
                        phone
                    }
                })


            return res.status(204).json({
                message: 'Usuário modificado com sucesso',
                id
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error
            }) 
        }
    }

    async createCustumer (req, res) {
        try {
            const { id } = req.params;
            const {
                loja_integrada_purchase_id,
                name,
                email,
                customName,
                customPhone,
                rank,
                phone
            
            } = req.body;

            if(!loja_integrada_purchase_id) res.send(400).json({ message: 'O id da compra da loja integrada é um '})

            await knex('Custumers')
                .insert({
                    ...name && {
                        name
                    },
                    ...email && {
                        email
                    },
                    ...customName && {
                        custon_name: customName
                    },
                    ...customPhone && {
                        custom_phone: customPhone
                    },
                    ...rank && {
                        rank
                    },
                    ...phone && {
                        phone
                    },
                    ...loja_integrada_purchase_id && {
                        loja_integrada_purchase_id
                    }
                })


            return res.status(201).json({
                message: 'Usuártio criado com sucesso',
                id
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error
            }) 
        }
    }

    async deleteCustumer (req, res) {
        try {
            const { id } = req.params;

            await knex('Custumers')
                .where('id', id)
                .del()

            return res.status(204).json({
                message: 'Usuário deletado com sucesso',
                id
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error
            }) 
        }
    }
}   


module.exports = new CategoriesControllers();
