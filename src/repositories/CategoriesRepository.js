const BaseRepository = require('./BaseRepository');

class CategoriesRepository extends BaseRepository {
    constructor(trx) {
        super('Categories', trx);
    }
}

module.exports = CategoriesRepository;
