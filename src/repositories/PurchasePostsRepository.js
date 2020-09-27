const BaseRepository = require('./BaseRepository');

class PurchasePostsRepository extends BaseRepository {
    constructor() {
        super('Purchase_posts');
    }
}

module.exports = new PurchasePostsRepository();
