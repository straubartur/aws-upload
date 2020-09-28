const BaseRepository = require('./BaseRepository');

class PurchasePostsRepository extends BaseRepository {
    constructor(trx) {
        super('Purchase_posts', trx);
    }
}

module.exports = PurchasePostsRepository;
