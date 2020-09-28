const knexfile = require('../../knexFile')

const knex = require('knex')(knexfile.development)

function getTransaction() {
    return knex.transaction();
}

module.exports = {
    knex,
    getTransaction
};
