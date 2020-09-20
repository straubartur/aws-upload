const BaseRepository = require('./BaseRepository');

class CustomersRepository extends BaseRepository {
    constructor() {
        super('Customers');
    }
}

module.exports = new CustomersRepository();
