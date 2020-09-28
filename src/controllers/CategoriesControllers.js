const CategoriesService = require('../services/CategoriesService');
const categoryValidator = require('../validator/CategoryValidator')
const { buildMessage } = require('../utils/buildMessage');
const { getTransaction } = require('../database/knex');

function getCategories(req, res) {
    const { pagination, limit, page } = req.query;
    const usePagination = pagination === 'false' ? false : true;

    const categoriesService = new CategoriesService();

    categoriesService.find(undefined, '*', {
            pagination: usePagination,
            limit,
            page
        })
        .then(result => res.status(200).json(result))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage('Ops! Algo deu errado =['));
        });
}

function getCategoryById(req, res) {
    const { id } = req.params;

    const categoriesService = new CategoriesService();

    categoriesService.findById(id)
        .then(result => res.status(200).json(result))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage('Ops! Algo deu errado =['));
        });
}

async function createCategory(req, res) {
    const newCategory = req.body || {};

    const { error } = categoryValidator.validate(newCategory);

    if (error) {
        return res.status(500).json(buildMessage('Ops! Algo deu errado =[', error));
    }

    const trx = await getTransaction();
    const categoriesService = new CategoriesService(trx);

    categoriesService.create(newCategory)
        .then(category => {
            trx.commit();
            res.status(201).json(buildMessage('Categoria criada com sucesso', { id: category.id }))
        })
        .catch(error => {
            console.log(error);
            trx.rollback();
            res.status(500).json(buildMessage('Ops! Algo deu errado =['));
        });
}

async function updateCategory(req, res) {
    const { id } = req.params;
    const category = req.body || {};

    const { error } = categoryValidator.validate(category);

    if (error) {
        return res.status(500).json(buildMessage('Ops! Algo deu errado =[', error));
    }

    const trx = await getTransaction();
    const categoriesService = new CategoriesService(trx);

    categoriesService.updateById(id, category)
        .then(() => {
            trx.commit();
            res.status(200).json(buildMessage('Categoria modificada com sucesso', { id }))
        })
        .catch(error => {
            console.log(error);
            trx.rollback();
            res.status(500).json(buildMessage('Ops! Algo deu errado =['));
        });
}

async function deleteCategory(req, res) {
    const { id } = req.params;

    const trx = await getTransaction();
    const categoriesService = new CategoriesService(trx);

    categoriesService.deleteById(id)
        .then(() => {
            trx.commit();
            res.sendStatus(204);
        })
        .catch(error => {
            console.log(error);
            trx.rollback();
            res.status(500).json(buildMessage('Ops! Algo deu errado =['));
        });
}

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
