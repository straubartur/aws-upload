const { buildMessage } = require('../utils/buildMessage');
const { getTransaction } = require('../database/knex');
const PurchasesService = require('../services/PurchasesService');

function getPurchases (req, res) {
    const { id } = req.params
    const { limit, page } = req.query;

    const purchasesService = new PurchasesService();

    purchasesService.find(where, '*', { limit, page })
        .then(result => res.status(200).json(result))
        .catch(error => {
            console.log(error);
            res.status(500).json(buildMessage('Ops! Algo deu errado =['));
        });
}

function getPurchaseById (req, res) {
    const { id } = req.params

    const purchasesService = new PurchasesService();

    purchasesService.findById(id)
        .then(result => res.status(200).json(result))
        .catch(error => {
            console.log(error);
            res.status(500).json(buildMessage('Ops! Algo deu errado =['));
        });
}

async function createPurchases (req, res) {
    const purchase = req.body || {};

    // TODO: Add validation schema

    const trx = await getTransaction();
    const purchasesService = new PurchasesService(trx);

    purchasesService.create(purchase)
        .then(() => {
            trx.commit();
            res.status(201).json(buildMessage('Compra criada com sucesso', { id: purchase.id }))
        })
        .catch(error => {
            console.log(error);
            trx.rollback();
            res.status(500).json(buildMessage('Ops! Algo deu errado =['));
        });
}

async function updatePurchases (req, res) {
    const { id } = req.params;
    const purchase = req.body || {};

    // TODO: Add validation schema

    const trx = await getTransaction();
    const purchasesService = new PurchasesService(trx);

    purchasesService.updateById(id, purchase)
        .then(() => {
            trx.commit();
            res.status(200).json(buildMessage('Compra modificado com sucesso', { id }))
        })
        .catch(error => {
            console.log(error);
            trx.rollback();
            res.status(500).json(buildMessage('Ops! Algo deu errado =['));
        });
}

async function deletePurchases (req, res) {
    const { id } = req.params;

    const trx = await getTransaction();
    const purchasesService = new PurchasesService(trx);

    purchasesService.deleteById(id)
        .then(() => {
            trx.commit();
            res.sendStatus(204)
        })
        .catch(error => {
            console.log(error);
            trx.rollback();
            res.status(500).json(buildMessage('Ops! Algo deu errado =['));
        });
}

function getGallery (req, res) {
    const { id } = req.params

    const purchasesService = new PurchasesService();

    purchasesService.getGallery(id)
        .then(result => res.status(200).json(result))
        .catch(error => {
            console.log(error);
            res.status(500).json(buildMessage('Ops! Algo deu errado =['));
        });
}

function generateLogoUrl (req, res) {
    const purchasesService = new PurchasesService();
    purchasesService.generateUrlToLogoUpload()
        .then(uploadURL => res.status(200).json(uploadURL))
        .catch(error => {
            console.log(error);
            res.status(500).json(buildMessage('Ops! Algo deu errado =['));
        });
}

/**
 * Method used to create a new purchase by transaction page.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function createPurchaseWithLogo (req, res) {
    const newPurchase = req.body || {};

    const trx = await getTransaction();
    const purchasesService = new PurchasesService(trx);

    purchasesService.createPurchaseWithLogo(newPurchase)
        .then(() => {
            trx.commit();
            res.status(201).json(buildMessage('Compra criado com sucesso', { id: newPurchase.id }))
        })
        .catch(error => {
            console.log(error);
            trx.rollback();
            res.status(500).json(buildMessage('Ops! Algo deu errado =['));
        });
}

module.exports = {
    getPurchases,
    getPurchaseById,
    createPurchases,
    updatePurchases,
    deletePurchases,
    getGallery,
    generateLogoUrl,
    createPurchaseWithLogo
};
