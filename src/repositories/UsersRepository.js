const BaseRepository = require('./BaseRepository');

class UsersRepository extends BaseRepository {
    constructor(trx) {
        super('Users', trx);
    }
}

module.exports = UsersRepository;
