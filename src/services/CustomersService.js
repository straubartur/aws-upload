const uuid = require('uuid');
const CustomersRepository = require('../repositories/CustomersRepository');

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

class CustomersService extends CustomersRepository {

    create(newCustomer) {
        newCustomer.id = uuid.v4();
    
        return this.findByLojaIntegradaClienteId(newCustomer.loja_integrada_cliente_id)
            .then(throwIfCustomerExist('loja_integrada_cliente_id'))
            .then(() => this.findByEmail(newCustomer.email))
            .then(throwIfCustomerExist('email'))
            .then(() => super.create(newCustomer))
            .then(() => newCustomer);
    }

    updateById(id, customer) {
        return this.findByLojaIntegradaClienteId(customer.loja_integrada_cliente_id)
            .then(throwIfOtherCustomerExistWithField('loja_integrada_cliente_id', customer))
            .then(() => this.findByEmail(customer.email))
            .then(throwIfOtherCustomerExistWithField('email', customer))
            .then(() => super.updateById(id, customer));
    }

    findByLojaIntegradaClienteId(loja_integrada_cliente_id) {
        return loja_integrada_cliente_id ? this.findOne({ loja_integrada_cliente_id }) : Promise.resolve();
    }

    findByEmail(email) {
        return email ? this.findOne({ email }) : Promise.resolve();
    }
}

module.exports = CustomersService;
