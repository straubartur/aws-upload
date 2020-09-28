const { buildMessage } = require('../utils/buildMessage');
const customersService = require('../services/CustomersService');

function getCustumers(req, res) {
    const { limit, page, email } = req.query;
    let findPromisse;

    if (email) {
        findPromisse = customersService.findByEmail(email);
    } else {
        findPromisse = customersService.find(undefined, '*', { limit, page });
    }

    findPromisse.then(result => res.status(200).json(result))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function getCustumerById (req, res) {
    const { id } = req.params

    customersService.findById(id)
        .then(result => res.status(200).json(result))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function createCustumer(req, res) {
    const newCustomer = req.body;

    // TODO: Add validation schema
    // if (!loja_integrada_purchase_id) res.send(400).json({ message: 'O id da compra da loja integrada é um ' })

    customersService.create(newCustomer)
        .then(() => res.status(201).json(buildMessage('Cliente criado com sucesso', { id: newCustomer.id })))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function updateCustumer(req, res) {
    const { id } = req.params;
    const customer = req.body;

    // TODO: Add validation schema
    // if (!loja_integrada_purchase_id) res.send(400).json({ message: 'O id da compra da loja integrada é um ' })

    customersService.updateById(id, customer)
        .then(() => res.status(200).json(buildMessage('Cliente modificado com sucesso', { id })))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function deleteCustumer(req, res) {
    const { id } = req.params;

    customersService.deleteById(id)
        .then(() => res.sendStatus(204))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

module.exports = {
    getCustumers,
    getCustumerById,
    createCustumer,
    updateCustumer,
    deleteCustumer
};
