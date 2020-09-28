const uuid = require('uuid');
const UsersRepository = require('../repositories/UsersRepository');

class UsersService extends UsersRepository {
    create(newUser) {
        newUser.id = uuid.v4();
    
        return super.create(newUser)
            .then(() => newUser);
    }

    findByEmail(email) {
        return super.findOne({ email }, '*');
    }
}

module.exports = UsersService;
