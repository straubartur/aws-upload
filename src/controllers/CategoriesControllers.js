const knex = require('../database/knex')

class CategoriesControllers {
    async getCategories(req, res) {
        const { id } = req.params
        const { date, limit, page } = req.query;
        try {
            const limitNumber = Number(limit || '10');
            const pageNumber = Number(page || '1');
            const offset = (pageNumber - 1) * limitNumber

            const model = () => knex('categories')
                .where((queryBuilder) => {
                    if (date) {
                        queryBuilder.where('categories.createdAt', '>=', date)
                    }
                    if(id) {
                        queryBuilder.where('id', id) 
                    }
                })


            const categories = await model()
                    .limit(limitNumber)
                    .offset(offset)
                    .select('*')


            const categoriesCount = await model()
                .count();
    
            const categoriesCountN = categoriesCount[0]
                && categoriesCount[0]['count(*)']
        
            const paginate = [{
                'page': pageNumber, 
                'itensFound' : categoriesCountN,
                'totalPages': Math.ceil(categoriesCountN / limitNumber)
            }]

            return res.status(200).json({
                data: categories,
                paginate
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error
            }) 
        }
    }

    async updateCategories (req, res) {
        try {
            const { id } = req.params;
            const { name, description } = req.body;

            console.log(req.params, orderId)

            await knex('Categories')
                .where('id', id)
                .update({
                    ...name && {
                        name
                    },
                    ...description && {
                        description
                    }
                })


            return res.status(204).json({
                message: 'categoria modificada com sucesso',
                id
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error
            }) 
        }
    }

    async createCategories (req, res) {
        try {
            const { id } = req.params;
            const { name, description } = req.body;

            if(!name) res.send(400).json({ message: 'O nome é um atributo obrtigatório'})
            if(!description) res.send(400).json({ message: 'A descrição é um atributo obrtigatório'})

            await knex('Categories')
                .insert({
                    ...name && {
                        name
                    },
                    ...description && {
                        description
                    }
                })


            return res.status(201).json({
                message: 'Descrição criada com sucesso',
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