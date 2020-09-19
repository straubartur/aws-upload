const { buildMessage } = require('../utils/buildMessage');
const purchasesRepository = require('../repositories/PurchasesRepository');
const uuid = require('uuid')

function getPurchases (req, res) {
    const { id } = req.params
    const { limit, page } = req.query;
    const where = id ? { id } : {};

    purchasesRepository.find(where, '*', { limit, page })
        .then(result => res.status(200).json(result))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function createPurchases (req, res) {
    const purchase = req.body || {};

    // TODO: Add validation schema

    purchase.id = uuid.v4();

    purchasesRepository.create(purchase)
        .then(() => {

            // TODO: If package is published
            // Customizer.PurchaseById(purchase);

            res.status(201).json(buildMessage('Compra criado com sucesso', { id: purchase.id }))
        })
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function updatePurchases (req, res) {
    const { id } = req.params;
    const purchase = req.body || {};

    // TODO: Add validation schema

    purchasesRepository.updateById(id, purchase)
        .then(() => res.status(200).json(buildMessage('Compra modificado com sucesso', { id })))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function deletePurchases (req, res) {
    const { id } = req.params;

    purchasesRepository.deleteById(id)
        .then(() => res.sendStatus(204))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function getGallery (req, res) {
    const { id } = req.params
    
    purchasesRepository.getGallery(id)
        .then(result => res.status(200).json(result))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

module.exports = {
    getPurchases,
    createPurchases,
    updatePurchases,
    deletePurchases,
    getGallery
};
