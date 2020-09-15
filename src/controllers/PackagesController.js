const { buildPaginate } = require('../utils/paginationResponse');
const { buildMessage } = require('../utils/buildMessage');
const knex = require('../database/knex')
const uuid = require('uuid')

class PackagesController {

    async getPackages (req, res) {
        const { id } = req.params
        const { limit, page } = req.query;
        try {
            const limitNumber = Number(limit || '10');
            const pageNumber = Number(page || '1');
            const offset = (pageNumber - 1) * limitNumber;

            const model = () => knex('Packages')
                .where((queryBuilder) => {
                    if(id) {
                        queryBuilder.where('id', id) 
                    }
                });


            const packages = await model()
                    .limit(limitNumber)
                    .offset(offset)
                    .select('*')

            const paginate = await buildPaginate(pageNumber, model, limitNumber);

            return res.status(200).json({
                data: packages,
                paginate
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json(buildMessage(error.message));
        }
    }

    async createPackage (req, res) {
        try {
            const pkg = req.body || {};

            if (!pkg.name) {
                return res.status(400).json(buildMessage('O nome é um atributo obrigatório'));
            }

            delete pkg.is_published;
            pkg.id = uuid.v4();

            await knex('Packages')
                .insert(pkg);

            return res.status(201).json(buildMessage('Package criado com sucesso', { id: pkg.id }));
        } catch (error) {
            console.log(error)
            return res.status(500).json(buildMessage(error.message));
        }
    }

    async updatePackage (req, res) {
        try {
            const { id } = req.params;
            const pkg = req.body || {};

            if (!pkg.name) {
                return res.send(400).json(buildMessage('O nome é um atributo obrigatório'));
            }

            delete pkg.is_published;

            await knex('Packages')
                .where('id', id)
                .update(pkg)

            return res.status(200).json(buildMessage('Package modificado com sucesso', id));
        } catch (error) {
            console.log(error)
            return res.status(500).json(buildMessage(error.message));
        }
    }

    async deletePackage (req, res) {
        try {
            const { id } = req.params;

            await knex('Packages')
                .where('id', id)
                .del()

            return res.status(204).json(buildMessage('Package deletada com sucesso', { id }));
        } catch (error) {
            console.log(error)
            return res.status(500).json(buildMessage(error.message));
        }
    }

    async publishPackage(req, res) {
        try {
            const { id } = req.params;

            const pkg = await knex('Packages')
                .where('id', id)
                .update({ is_published: true })

            // TODO: customizar todos os pacotes comprados!
            // Customizer.AllPurchasesByPackage(pkg);

            return res.status(200).json(buildMessage('Package publicada com sucesso'));
        } catch (error) {
            console.log(error)
            return res.status(500).json(buildMessage(error.message));
        }
    }
}

module.exports = new PackagesController();
