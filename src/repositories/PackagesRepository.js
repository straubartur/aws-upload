const BaseRepository = require('./BaseRepository');

class PackageRepository extends BaseRepository {
    constructor(trx) {
        super('Packages', trx);
    }
}

module.exports = PackageRepository;
