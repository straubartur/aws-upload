const uuid = require('uuid')
const { buildPaginate } = require('../utils/paginationResponse');
const knex = require('../database/knex')

class CategoriesControllers {
    async getCategories(req, res) {
        const { id } = req.params
        const { date, limit, page } = req.query;
        try {
            const limitNumber = Number(limit || '10');
            const pageNumber = Number(page || '1');
            const offset = (pageNumber - 1) * limitNumber

            const model = () => knex('Categories')
                .where((queryBuilder) => {
                    if (date) {
                        queryBuilder.where('Categories.createdAt', '>=', date)
                    }
                    if(id) {
                        queryBuilder.where('id', id) 
                    }
                })

            const categories = await model()
                    .limit(limitNumber)
                    .offset(offset)
                    .select('*')

            const paginate = await buildPaginate(pageNumber, model, limitNumber);

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
            const category = req.body || {};

            if(!category.name) res.send(400).json({ message: 'O nome é um atributo obrigatório'})
            if(!category.description) res.send(400).json({ message: 'A descrição é um atributo obrigatório'})

            await knex('Categories')
                .where('id', id)
                .update(category);

            return res.status(200).json({
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
            const category = req.body || {};

            if(!category.name) res.status(400).json({ message: 'O nome é um atributo obrigatório'})
            if(!category.description) res.status(400).json({ message: 'A descrição é um atributo obrigatório'})

            category.id = uuid.v4();

            await knex('Categories')
                .insert(category);

            return res.status(201).json({
                message: 'Categoria criada com sucesso',
                id: category.id
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error
            }) 
        }
    }

    async deleteCategories (req, res) {
        try {
            const { id } = req.params;

            await knex('Categories')
                .where('id', id)
                .del()

            return res.status(204).json({
                message: 'Categoria deletada com sucesso',
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
