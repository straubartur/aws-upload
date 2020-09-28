const { buildMessage } = require('../utils/buildMessage');
const { buildPostResponse } = require('../utils/buildPostResponse');
const { getTransaction } = require('../database/knex');
const PackagesService = require('../services/PackagesService');
const packageValidator = require('../validator/PackageValidator');

function getPackages (req, res) {
    const { limit, page } = req.query;
    const packagesService = new PackagesService();

    packagesService.find(undefined, '*', { limit, page })
        .then(result => res.status(200).json(result))
        .catch(error => {
            console.log(error);
            res.status(500).json(buildMessage('Ops! Algo deu errado =['));
        });
}

function getPackageById(req, res) {
    const { id } = req.params;
    const packagesService = new PackagesService();

    packagesService.findById(id)
        .then(package => {
            package.posts = package.posts.map(buildPostResponse);
            return package;
        })
        .then(package => res.status(200).json(package))
        .catch(error => {
            console.log(error);
            res.status(500).json(buildMessage('Ops! Algo deu errado =['));
        });
}

async function savePackage (req, res) {
    const package = req.body || {};

    const { error } = packageValidator.Package.validate(package);

    if (error) {
        return res.status(500).json(buildMessage('Ops! Algo deu errado =[', error));
    }

    const trx = await getTransaction();
    const packagesService = new PackagesService(trx);

    packagesService.save(package)
        .then(() => {
            trx.commit();
            res.status(201).json(buildMessage('Package salvo com sucesso'))
        })
        .catch(error => {
            console.log(error);
            trx.rollback();
            res.status(500).json(buildMessage('Ops! Algo deu errado =['));
        });
}

async function deletePackage (req, res) {
    const { id } = req.params;

    const trx = await getTransaction();
    const packagesService = new PackagesService(trx);

    packagesService.deleteById(id)
        .then(() => {
            trx.commit();
            res.status(204).json(buildMessage('Package deletado com sucesso', { id }))
        })
        .catch(error => {
            console.log(error);
            trx.rollback();
            res.status(500).json(buildMessage('Ops! Algo deu errado =['));
        });
}

async function publishPackage(req, res) {
    const { id } = req.params;

    const trx = await getTransaction();
    const packagesService = new PackagesService(trx);

    packagesService.publishPackage(id)
        .then(() => {
            trx.commit();
            res.status(200).json(buildMessage('Package publicado com sucesso', { id }))
        })
        .catch(error => {
            console.log(error);
            trx.rollback();
            res.status(500).json(buildMessage('Ops! Algo deu errado =['));
        });
}

function generateUrls(req, res) {
    const { packageId } = req.query;
    const contentTypeList = req.body || [];

    const packagesService = new PackagesService();

    packagesService.generateUrls(packageId, contentTypeList)
        .then(uploadURLs => res.status(200).json(uploadURLs))
        .catch(error => {
            console.log(error);
            trx.rollback();
            res.status(500).json(buildMessage('Ops! Algo deu errado =['));
        });
}

module.exports = {
    getPackages,
    getPackageById,
    savePackage,
    deletePackage,
    publishPackage,
    generateUrls
};
