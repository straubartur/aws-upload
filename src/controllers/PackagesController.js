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


            const packagesCount = await model()
                .count();
    
            const packagesCountN = packagesCount[0]
                && packagesCount[0]['count(*)']
        
            const paginate = [{
                'page': pageNumber, 
                'itensFound' : packagesCountN,
                'totalPages': Math.ceil(packagesCount / limitNumber) || 1
            }]

            return res.status(200).json({
                data: packages,
                paginate
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error
            }) 
        }
    }

    async createPackage (req, res) {
        try {
            const pkg = req.body || {};

            if (!pkg.name) {
                return res.send(400).json({
                    message: 'O nome é um atributo obrigatório'
                });
            }

            delete pkg.is_published;
            pkg.id = uuid.v4();

            await knex('Packages')
                .insert(pkg);

            return res.status(201).json({
                message: 'Package criada com sucesso',
                id: pkg.id
            });
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error
            }) 
        }
    }

    async updatePackage (req, res) {
        try {
            const { id } = req.params;
            const pkg = req.body || {};

            if (!pkg.name) {
                return res.send(400).json({
                    message: 'O nome é um atributo obrigatório'
                });
            }

            delete pkg.is_published;

            await knex('Packages')
                .where('id', id)
                .update(pkg)

            return res.status(200).json({
                message: 'Package modificada com sucesso',
                id
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error
            }) 
        }
    }

    async deletePackage (req, res) {
        try {
            const { id } = req.params;

            await knex('Packages')
                .where('id', id)
                .del()

            return res.status(204).json({
                message: 'Package deletada com sucesso',
                id
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error
            }) 
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

            return res.status(200).json({
                message: 'Package publicada com sucesso'
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error
            }) 
        }
    }
}

module.exports = new PackagesController();
