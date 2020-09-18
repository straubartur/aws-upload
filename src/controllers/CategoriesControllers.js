const uuid = require('uuid')
const categoriesRepository = require('../repositories/CategoriesRepository');
const { buildMessage } = require('../utils/buildMessage');

function getCategory(req, res) {
    const { id } = req.params
    const { limit, page } = req.query;

    const where = (queryBuilder) => {
        if(id) {
            queryBuilder.where('id', id) 
        }
    };

    categoriesRepository.find(where, '*', { limit, page })
        .then(result => res.status(200).json(result))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function createCategory(req, res) {
    const category = req.body || {};

    if (!category.name) {
        return res.status(400).json(buildMessage('O nome é um atributo obrigatório'));
    }
    if (!category.description) {
        return res.status(400).json(buildMessage('A descrição é um atributo obrigatório'));
    }

    category.id = uuid.v4();

    categoriesRepository.create(category)
        .then(() => res.status(201).json(buildMessage('Categoria criada com sucesso', { id: category.id })))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function updateCategory(req, res) {
    const { id } = req.params;
    const category = req.body || {};

    if (!category.name) {
        return res.status(400).json(buildMessage('O nome é um atributo obrigatório'));
    }
    if (!category.description) {
        return res.status(400).json(buildMessage('A descrição é um atributo obrigatório'));
    }

    categoriesRepository.updateById(id, category)
        .then(() => res.status(200).json(buildMessage('Categoria modificada com sucesso', { id })))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function deleteCategory(req, res) {
    const { id } = req.params;

    categoriesRepository.deleteById(id)
        .then(() => res.sendStatus(204))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

module.exports = {
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
};
