const { buildMessage } = require('../utils/buildMessage');
const packageRepository = require('../repositories/PackagesRepository');
const uuid = require('uuid')

function getPackages (req, res) {
    const { id } = req.params
    const { limit, page } = req.query;

    const where = (queryBuilder) => {
        if(id) {
            queryBuilder.where('id', id) 
        }
    };

    packageRepository.find(where, '*', { limit, page })
        .then(result => res.status(200).json(result))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function createPackage (req, res) {
    const pkg = req.body || {};

    if (!pkg.name) {
        return res.status(400).json(buildMessage('O nome é um atributo obrigatório'));
    }

    delete pkg.is_published;
    pkg.id = uuid.v4();

    packageRepository.create(pkg)
        .then(() => res.status(201).json(buildMessage('Package criado com sucesso', { id: pkg.id })))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function updatePackage (req, res) {
    const { id } = req.params;
    const pkg = req.body || {};

    if (!pkg.name) {
        return res.status(400).json(buildMessage('O nome é um atributo obrigatório'));
    }

    delete pkg.is_published;

    packageRepository.updateById(id, pkg)
        .then(() => res.status(200).json(buildMessage('Package modificado com sucesso', { id })))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function deletePackage (req, res) {
    const { id } = req.params;
    
    packageRepository.deleteById(id)
        .then(() => res.status(204).json(buildMessage('Package deletado com sucesso', { id })))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function publishPackage(req, res) {
    const { id } = req.params;

    packageRepository.updateById(id, { is_published: true })
        .then(() => {

            // TODO: customizar todos os pacotes comprados!
            // Customizer.AllPurchasesByPackage(pkg);

            res.status(200).json(buildMessage('Package publicado com sucesso', { id }));
        })
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

module.exports = {
    getPackages,
    createPackage,
    updatePackage,
    deletePackage,
    publishPackage
};
