const knex = require('../database/knex')

class CampaginsControllers {
    async getCampaigns(req, res) {
        const { id } = req.params
        const { date, limit, page } = req.query;
        try {
            const limitNumber = Number(limit || '10');
            const pageNumber = Number(page || '1');
            const offset = (pageNumber - 1) * limitNumber

            const model = () => knex('Campagins')
                .where((queryBuilder) => {
                    if (date) {
                        queryBuilder.where('Campagins.createdAt', '>=', date)
                    }
                    if(id) {
                        queryBuilder.where('id', id) 
                    }
                })


            const campaigns = await model()
                    .limit(limitNumber)
                    .offset(offset)
                    .select('*')


            const campaignsCount = await model()
                .count();
    
            const campaignsCountN = campaignsCount[0]
                && campaignsCount[0]['count(*)']
        
            const paginate = [{
                'page': pageNumber, 
                'itensFound' : campaignsCountN,
                'totalPages': Math.ceil(campaignsCountN / limitNumber)
            }]

            return res.status(200).json({
                data: campaigns,
                paginate
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error
            }) 
        }
    }

    async updateCampaigns (req, res) {
        try {
            const { id } = req.params;
            const { name, endDate, isPublished } = req.body;

            console.log(req.params, orderId)

            await knex('Campaigns')
                .where('id', id)
                .update({
                    ...name && {
                        name
                    },
                    ...endDate && {
                        end_date: endDate
                    },
                    ...isPublished && {
                        is_publised: isPublished
                    }
                })


            return res.status(204).json({
                message: 'campanha modificada com sucesso',
                id
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error
            }) 
        }
    }

    async createCampaigns (req, res) {
        try {
            const { name, isPublished, endDate } = req.body;

            if(!name) res.send(400).json({ message: 'O nome é um atributo obrtigatório'})

            await knex('Campaigns')
                .insert({
                    ...name && {
                        name
                    },
                    ...isPublished && {
                        is_publised: isPublished
                    },
                    ...endDate && {
                        end_date: endDate
                    }
                })


            return res.status(201).json({
                message: 'Campanha criada com sucesso',
                id
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error
            }) 
        }
    }

    async deleteCampaigns (req, res) {
        try {
            const { id } = req.params;

            await knex('Campaigns')
                .where('id', id)
                .del()

            return res.status(204).json({
                message: 'campanha deletada com sucesso',
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


module.exports = new CampaginsControllers();