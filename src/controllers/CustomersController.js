const { buildMessage } = require('../utils/buildMessage');
const { getTransaction } = require('../database/knex');
const CustomersService = require('../services/CustomersService');
const customerValidator = require('../validator/CustomerValidator');

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

    const customersService = new CustomersService();

    customersService.findById(id)
        .then(result => res.status(200).json(result))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function getCustumerById (req, res) {
    const { id } = req.params

    const customersService = new CustomersService();

    customersService.findById(id)
        .then(result => res.status(200).json(result))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

async function createCustumer(req, res) {
    const newCustomer = req.body;

    const { error } = customerValidator.validate(newCustomer);

    if (error) {
        return res.status(500).json(buildMessage('Ops! Algo deu errado =[', error));
    }

    const trx = await getTransaction();
    const customersService = new CustomersService(trx);

    customersService.create(newCustomer)
        .then(() => {
            trx.commit();
            res.status(201).json(buildMessage('Cliente criado com sucesso', { id: newCustomer.id }))
        })
        .catch(error => {
            console.log(error);
            trx.rollback();
            res.status(500).json(buildMessage('Ops! Algo deu errado =['));
        });
}

async function updateCustumer(req, res) {
    const { id } = req.params;
    const customer = req.body;

    const { error } = customerValidator.validate(customer);

    if (error) {
        return res.status(500).json(buildMessage('Ops! Algo deu errado =[', error));
    }

    const trx = await getTransaction();
    const customersService = new CustomersService(trx);

    customersService.updateById(id, customer)
        .then(() => {
            trx.commit();
            res.status(200).json(buildMessage('Cliente modificado com sucesso', { id }))
        })
        .catch(error => {
            console.log(error);
            trx.rollback();
            res.status(500).json(buildMessage('Ops! Algo deu errado =['));
        });
}

async function deleteCustumer(req, res) {
    const { id } = req.params;

    const trx = await getTransaction();
    const customersService = new CustomersService(trx);

    customersService.deleteById(id)
        .then(() => {
            trx.commit();
            res.sendStatus(204);
        })
        .catch(error => {
            console.log(error);
            trx.rollback();
            res.status(500).json(buildMessage('Ops! Algo deu errado =['));
        });
}

module.exports = {
    getCustumers,
    getCustumerById,
    createCustumer,
    updateCustumer,
    deleteCustumer
};
