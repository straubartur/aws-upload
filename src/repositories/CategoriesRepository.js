const BaseRepository = require('./BaseRepository');

class CategoriesRepository extends BaseRepository {
    constructor() {
        super('Categories');
    }
}

module.exports = new CategoriesRepository();
