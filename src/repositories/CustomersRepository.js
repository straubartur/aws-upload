const BaseRepository = require('./BaseRepository');

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

class PurchasesRepository extends BaseRepository {
    constructor() {
        super('Customers');
    }

    create(newCustomer) {
        return this.findByLojaIntegradaId(newCustomer.loja_integrada_id)
            .then(throwIfCustomerExist('loja_integrada_id'))
            .then(() => this.findByEmail(newCustomer.email))
            .then(throwIfCustomerExist('email'))
            .then(() => super.create(newCustomer));
    }

    updateById(id, customer) {
        return this.findByLojaIntegradaId(customer.loja_integrada_id)
            .then(throwIfOtherCustomerExistWithField('loja_integrada_id', customer))
            .then(() => this.findByEmail(customer.email))
            .then(throwIfOtherCustomerExistWithField('email', customer))
            .then(() => super.updateById(id, customer));
    }

    findByLojaIntegradaId(loja_integrada_id) {
        return loja_integrada_id ? this.findOne({ loja_integrada_id }) : Promise.resolve();
    }

    findByEmail(email) {
        return email ? this.findOne({ email }) : Promise.resolve();
    }
}

module.exports = new PurchasesRepository();
