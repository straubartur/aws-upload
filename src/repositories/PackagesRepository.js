const BaseRepository = require('./BaseRepository');

class PackageRepository extends BaseRepository {
    constructor() {
        super('Packages');
    }
}

module.exports = new PackageRepository();
