const { buildMessage } = require('../utils/buildMessage');
const packagesService = require('../services/PackagesService');
const packageValidator = require('../validator/PackageValidator')

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

function savePackage (req, res) {
    const package = req.body || {};

    const { error } = packageValidator.Package.validate(package);

    if (error) {
        return res.status(500).json(buildMessage('Ops! Algo deu errado =[', error));
    }

    packagesService.save(package)
        .then(() => res.status(201).json(buildMessage('Package salvo com sucesso')))
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
   const { packageId } = req.query;
   const contentTypeList = req.body || [];

    packagesService.generateUrls(packageId, contentTypeList)
        .then(uploadURLs => res.status(200).json(uploadURLs))
}

module.exports = {
    getPackages,
    getPackageById,
    savePackage,
    deletePackage,
    publishPackage,
    generateUrls
};
