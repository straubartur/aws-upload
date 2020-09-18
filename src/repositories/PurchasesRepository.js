const BaseRepository = require('./BaseRepository');

class PurchasesRepository extends BaseRepository {
    constructor() {
        super('Purchases');
    }
}

module.exports = new PurchasesRepository();
