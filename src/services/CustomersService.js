const customersRepository = require('../repositories/CustomersRepository');
const uuid = require('uuid');

function throwIfCustomerExist(field) {
    return (customer) => {
        if (customer) {
            throw new Error(`Já existe com um cliente[${customer.id}] com ${field}[${customer[field]}]`);
        }
    }
}

function throwIfOtherCustomerExistWithField(field, newCustomer) {
    return (customer) => {
        if (customer && customer.id !== newCustomer.id) {
            throw new Error(`Já existe com um cliente[${customer.id}] com ${field}[${customer[field]}]`);
        }
    }
}

function create(newCustomer) {
    newCustomer.id = uuid.v4();

    return findByLojaIntegradaClienteId(newCustomer.loja_integrada_cliente_id)
        .then(throwIfCustomerExist('loja_integrada_cliente_id'))
        .then(() => findByEmail(newCustomer.email))
        .then(throwIfCustomerExist('email'))
        .then(() => customersRepository.create(newCustomer))
        .then(() => newCustomer);
}

function updateById(id, customer) {
    return findByLojaIntegradaClienteId(customer.loja_integrada_cliente_id)
        .then(throwIfOtherCustomerExistWithField('loja_integrada_cliente_id', customer))
        .then(() => findByEmail(customer.email))
        .then(throwIfOtherCustomerExistWithField('email', customer))
        .then(() => customersRepository.updateById(id, customer));
}

function deleteById(id) {
    return customersRepository.deleteById(id);
}

function find(where, select, options) {
    return customersRepository.find(where, select, options);
}

function findByLojaIntegradaClienteId(loja_integrada_cliente_id) {
    return loja_integrada_cliente_id ? customersRepository.findOne({ loja_integrada_cliente_id }) : Promise.resolve();
}

function findByEmail(email) {
    return email ? customersRepository.findOne({ email }) : Promise.resolve();
}

module.exports = {
    create,
    updateById,
    deleteById,
    find,
    findByLojaIntegradaClienteId,
    findByEmail
};
