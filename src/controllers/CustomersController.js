const { buildMessage } = require('../utils/buildMessage');
const customersRepository = require('../repositories/CustomersRepository');
const uuid = require('uuid')

function getCustumers(req, res) {
    const { id } = req.params
    const { limit, page } = req.query;
    const where = id ? { id } : {};

    customersRepository.find(where, '*', { limit, page })
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

    newCustomer.id = uuid.v4();

    customersRepository.create(newCustomer)
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

    customersRepository.updateById(id, customer)
        .then(() => res.status(200).json(buildMessage('Cliente modificado com sucesso', { id })))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function deleteCustumer(req, res) {
    const { id } = req.params;

    customersRepository.deleteById(id)
        .then(() => res.sendStatus(204))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

module.exports = {
    getCustumers,
    createCustumer,
    updateCustumer,
    deleteCustumer
};
