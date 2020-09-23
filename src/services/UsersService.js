const usersRepository = require('../repositories/UsersRepository');
const uuid = require('uuid');

function create(newUser) {
    newUser.id = uuid.v4();

    return usersRepository.create(newUser)
        .then(() => newUser);
}

function updateById(id, user) {
    return usersRepository.updateById(id, user);
}

function deleteById(id) {
    return usersRepository.deleteById(id);
}

function find(where, select, options) {
    return usersRepository.find(where, select, options);
}

function findById(id) {
    return usersRepository.findById(id);
}

function findByEmail(email) {
    return usersRepository.findOne({ email }, '*');
}

module.exports = {
    create,
    updateById,
    deleteById,
    find,
    findById,
    findByEmail
};
