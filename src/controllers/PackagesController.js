const { buildMessage } = require('../utils/buildMessage');
const packagesService = require('../services/PackagesService');

function getPackages (req, res) {
    const { limit, page } = req.query;

    packagesService.find(undefined, '*', { limit, page })
        .then(result => res.status(200).json(result))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function getPackageById(req, res) {
    const { id } = req.params;

    packagesService.findById(id)
        .then(result => res.status(200).json(result))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function createPackage (req, res) {
    const newPackage = req.body || {};

    if (!newPackage.name) {
        return res.status(400).json(buildMessage('O nome é um atributo obrigatório'));
    }

    packagesService.create(newPackage)
        .then((pkg) => res.status(201).json(buildMessage('Package criado com sucesso', { id: pkg.id })))
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

    packagesService.updateById(id, pkg)
        .then(() => res.status(200).json(buildMessage('Package modificado com sucesso', { id })))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function deletePackage (req, res) {
    const { id } = req.params;
    
    packagesService.deleteById(id)
        .then(() => res.status(204).json(buildMessage('Package deletado com sucesso', { id })))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function publishPackage(req, res) {
    const { id } = req.params;

    packagesService.publishPackage(id)
        .then(() => res.status(200).json(buildMessage('Package publicado com sucesso', { id })))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function generateUrls(req, res) {
    const { quantity } = req.params;
    const { packageId } = req.query;
    const urlQuantity = Number(quantity);

    if (Number.isNaN(urlQuantity) || urlQuantity < 1) {
        return res.status(500).json(buildMessage('Quantidade de URL precisa ser um número maior que 0.'));
    }

    packagesService.generateUrls(packageId, urlQuantity)
        .then(uploadURLs => res.status(200).json(uploadURLs))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

module.exports = {
    getPackages,
    getPackageById,
    createPackage,
    updatePackage,
    deletePackage,
    publishPackage,
    generateUrls
};
