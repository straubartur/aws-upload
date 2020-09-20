const { buildMessage } = require('../utils/buildMessage');
const purchasesService = require('../services/PurchasesService');

function getPurchases (req, res) {
    const { id } = req.params
    const { limit, page } = req.query;
    const where = id ? { id } : {};

    purchasesService.find(where, '*', { limit, page })
        .then(result => res.status(200).json(result))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function createPurchases (req, res) {
    const purchase = req.body || {};

    // TODO: Add validation schema

    purchasesService.create(purchase)
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function updatePurchases (req, res) {
    const { id } = req.params;
    const purchase = req.body || {};

    // TODO: Add validation schema

    purchasesService.updateById(id, purchase)
        .then(() => res.status(200).json(buildMessage('Compra modificado com sucesso', { id })))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function deletePurchases (req, res) {
    const { id } = req.params;

    purchasesService.deleteById(id)
        .then(() => res.sendStatus(204))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function getGallery (req, res) {
    const { id } = req.params
    
    purchasesService.getGallery(id)
        .then(result => res.status(200).json(result))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function generateLogoUrl (req, res) {
    purchasesService.generateUrlToLogoUpload()
        .then(uploadURL => res.status(200).json(uploadURL))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

/**
 * Method used to create a new purchase by transaction page.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function createPurchaseWithLogo (req, res) {
    const newPurchase = req.body || {};

    purchasesService.createPurchaseWithLogo(newPurchase)
        .then(() => res.status(201).json(buildMessage('Compra criado com sucesso', { id: newPurchase.id })))
        .catch(error => {
            console.error(error)
            res.status(500).json(buildMessage(error.message));
        });
}

module.exports = {
    getPurchases,
    createPurchases,
    updatePurchases,
    deletePurchases,
    getGallery,
    generateLogoUrl,
    createPurchaseWithLogo
};
