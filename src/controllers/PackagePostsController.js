const { buildMessage } = require('../utils/buildMessage');
const PackagePostValidator = require('../validator/PackagePostValidator');
const packagePostsService = require('../services/PackagePostsService');

function getPosts(req, res) {
    const { packageId } = req.params
    const { limit, page, categoryId } = req.query;
    const where = { package_id: packageId };

    if (categoryId) {
        where.category_id = categoryId;
    }

    packagePostsService.find(where, '*', { limit, page })
        .then(result => res.status(200).json(result))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function getPostById(req, res) {
    const { id, packageId } = req.params

    packagePostsService.findById(id, packageId)
        .then(result => res.status(200).json(result))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function createPosts(req, res) {
    const body = req.body || [];

    const { error } = PackagePostValidator.PackagePostList.validate(body);

    if (error) {
        return res.status(500).json(buildMessage('Ops! Algo deu errado =[', error));
    }

    packagePostsService.create(body)
        .then(() => res.status(201).json(buildMessage('Posts criado com sucesso')))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function deletePost(req, res) {
    const { id, packageId } = req.params;

    packagePostsService.deleteById(id, packageId)
        .then(() => res.sendStatus(204))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function generateUrls(req, res) {
    const { packageId, quantity } = req.params;
    const urlQuantity = Number(quantity);

    if (Number.isNaN(urlQuantity) || urlQuantity < 1) {
        return res.status(500).json(buildMessage('Quantidade de URL precisa ser um número maior que 0.'));
    }

    packagePostsService.generateUrlToPostUpload(packageId, urlQuantity)
        .then(uploadURLs => res.status(200).json(uploadURLs))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

module.exports = {
    getPosts,
    getPostById,
    createPosts,
    deletePost,
    generateUrls
};
