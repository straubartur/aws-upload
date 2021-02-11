
const CategoriesService = require('../services/CategoriesService');
const categoryValidator = require('../validator/CategoryValidator')
const { buildMessage } = require('../utils/buildMessage');
const { getTransaction } = require('../database/knex');

function getById(Service) {
    return async function getById(req, res) {
        const { id } = req.params;
    
        Service.findById(id)
            .then(result => res.status(200).json(result))
            .catch(error => {
                console.log(error)
                res.status(500).json(buildMessage('Ops! Algo deu errado =['));
            });
    }
}

async function deleteBy(Service) {
    return async function(req, res) {
        const { id } = req.params;

        const trx = await getTransaction();

        Service.deleteById(id)
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
}

async function create(Service, validator) {
    return async function(req, res) {
        const { body } = req.body || {};
    
        const { error } = validator.validate(body);
    
        if (error) {
            return res.status(500).json(buildMessage('Ops! Algo deu errado =[', error));
        }
    
        const trx = await getTransaction();
    
        Service.create(body)
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
}


function update(Service, validator) {
    return async function (req, res) {
        const { id } = req.params;
        const { body } = req.body || {};
    
        const { error } = validator.validate(body);
    
        if (error) {
            return res.status(500).json(buildMessage('Ops! Algo deu errado =[', error));
        }
    
        const trx = await getTransaction();
    
        Service.updateById(id, body)
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
}



module.exports = (() => {
    const categoryService = new CategoriesService(trx)
    return {
        getCategories: get(categoryService),
        getCategoriesById: getById(categoryService),
        createCategory: create(categoryService, categoryValidator),
        updateCategory: update(categoryService, categoryValidator),
        deleteCategory: deleteBy(categoryService)
    }
})();
