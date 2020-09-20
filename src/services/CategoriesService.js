const categoriesRepository = require('../repositories/CategoriesRepository');
const uuid = require('uuid');

function create(newCategory) {
    newCategory.id = uuid.v4();

    return categoriesRepository.create(newCategory)
        .then(() => newCategory);
}

function updateById(id, category) {
    return categoriesRepository.updateById(id, category);
}

function deleteById(id) {
    return categoriesRepository.deleteById(id);
}

function find(where, select, options) {
    return categoriesRepository.find(where, select, options);
}

function findById(id) {
    return categoriesRepository.findById(id);
}

module.exports = {
    create,
    updateById,
    deleteById,
    find,
    findById
};
