const knex = require('../database/knex')

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
                'totalPages': Math.ceil(packagesCount / limitNumber) || 0
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
            const body = req.body;

            if (!body.name) {
                return res.send(400).json({
                    message: 'O nome é um atributo obrtigatório'
                });
            }

            const id = await knex('Packages')
                .insert(body);

            return res.status(201).json({
                message: 'Package criada com sucesso',
                id: id.pop()
            })
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
            const body = req.body;

            console.log(req.params, id)

            await knex('Packages')
                .where('id', id)
                .update(body)


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
}

module.exports = new PackagesController();
