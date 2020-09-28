const BaseRepository = require('./BaseRepository');

class PackagePostsRepository extends BaseRepository {
    constructor(trx) {
        super('Package_posts', trx);
    }
}

module.exports = PackagePostsRepository;
