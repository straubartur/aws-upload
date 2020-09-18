const BaseRepository = require('./BaseRepository');

class PackagePostsRepository extends BaseRepository {
    constructor() {
        super('Package_posts');
    }
}

module.exports = new PackagePostsRepository();
