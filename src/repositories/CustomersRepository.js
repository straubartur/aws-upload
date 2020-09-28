const BaseRepository = require('./BaseRepository');

class CustomersRepository extends BaseRepository {
    constructor(trx) {
        super('Customers', trx);
    }
}

module.exports = CustomersRepository;
