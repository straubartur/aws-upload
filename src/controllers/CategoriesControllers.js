const uuid = require('uuid')
const { buildPaginate } = require('../utils/paginationResponse');
const { buildMessage } = require('../utils/buildMessage');
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
            return res.status(500).json(buildMessage(error.message));
        }
    }

    async updateCategories (req, res) {
        try {
            const { id } = req.params;
            const category = req.body || {};

            if(!category.name) {
                return res.status(400).json(buildMessage('O nome é um atributo obrigatório'));
            }
            if(!category.description) {
                return res.status(400).json(buildMessage('A descrição é um atributo obrigatório'));
            }

            await knex('Categories')
                .where('id', id)
                .update(category);

            return res.status(200).json(buildMessage('categoria modificada com sucesso', { id }));
        } catch (error) {
            console.log(error)
            return res.status(500).json(buildMessage(error.message));
        }
    }

    async createCategories (req, res) {
        try {
            const category = req.body || {};

            if(!category.name) {
                return res.status(400).json(buildMessage('O nome é um atributo obrigatório'));
            }
            if(!category.description) {
                return res.status(400).json(buildMessage('A descrição é um atributo obrigatório'));
            }

            category.id = uuid.v4();

            await knex('Categories')
                .insert(category);

            return res.status(201).json(buildMessage('Categoria criada com sucesso', { id: category.id }));
        } catch (error) {
            console.log(error)
            return res.status(500).json(buildMessage(error.message));
        }
    }

    async deleteCategories (req, res) {
        try {
            const { id } = req.params;

            await knex('Categories')
                .where('id', id)
                .del()

            return res.status(204).json(buildMessage('Categoria deletada com sucesso', { id }));
        } catch (error) {
            console.log(error)
            return res.status(500).json(buildMessage(error.message));
        }
    }
}

module.exports = new CategoriesControllers();
