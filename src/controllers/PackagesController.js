const { buildMessage } = require('../utils/buildMessage');
const { buildPostResponse } = require('../utils/buildPostResponse');
const { getTransaction } = require('../database/knex');
const packagesService = require('../services/PackagesService');
const packageValidator = require('../validator/PackageValidator');
const { syncPurchasePostsByPackageId } = require('../managers/purchase-manager');

async function getPackages (req, res) {
    const { limit, page } = req.query;
    const trx = await getTransaction();

    packagesService.find(trx, undefined, '*', { limit, page })
        .then(result => res.status(200).json(result))
        .catch(error => {
            console.log(error);
            res.status(500).json(buildMessage('Ops! Algo deu errado =['));
        });
}

async function getPackageById(req, res) {
    const { id } = req.params;
    const trx = await getTransaction();

    packagesService.findById(trx, id)
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
    let pkg = req.body || {};

    const { error } = packageValidator.Package.validate(pkg);

    if (error) {
        return res.status(500).json(buildMessage('Ops! Algo deu errado =[', error));
    }

    try {
        const trx = await getTransaction();
        
        await packagesService.save(trx, pkg)
        console.log("bla bla bla");
        await trx.commit();
        res.status(201).json(buildMessage('Package salvo com sucesso'))
        // syncPurchasePostsByPackageId(pkg.id);
        setTimeout(syncPurchasePostsByPackageId, 0, pkg.id);
    } catch(error) {
        console.log(error);
        trx.rollback();
        res.status(500).json(buildMessage('Ops! Algo deu errado =['));
    }
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
