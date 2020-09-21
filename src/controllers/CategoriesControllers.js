const categoriesService = require('../services/CategoriesService');
const { buildMessage } = require('../utils/buildMessage');

function getCategories(req, res) {
    const { limit, page } = req.query;

    categoriesService.find(undefined, '*', { limit, page })
        .then(result => res.status(200).json(result))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function getCategoryById(req, res) {
    const { id } = req.params;

    categoriesService.findById(id)
        .then(result => res.status(200).json(result))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function createCategory(req, res) {
    const newCategory = req.body || {};

    if (!newCategory.name) {
        return res.status(400).json(buildMessage('O nome é um atributo obrigatório'));
    }
    if (!newCategory.description) {
        return res.status(400).json(buildMessage('A descrição é um atributo obrigatório'));
    }

    categoriesService.create(newCategory)
        .then(category => res.status(201).json(buildMessage('Categoria criada com sucesso', { id: category.id })))
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

    categoriesService.updateById(id, category)
        .then(() => res.status(200).json(buildMessage('Categoria modificada com sucesso', { id })))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function deleteCategory(req, res) {
    const { id } = req.params;

    categoriesService.deleteById(id)
        .then(() => res.sendStatus(204))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
