const uuid = require('uuid')
const { buildMessage } = require('../utils/buildMessage');
const PackagePostValidator = require('../validator/PackagePostValidator');
const packagePostsRepository = require('../repositories/PackagePostsRepository');
const packageRepository = require('../repositories/PackagesRepository');
const S3 = require('../services/s3')

function getPackagePostPathOfS3(packageId, postId) {
    return `packages/${packageId}/posts/${postId}`;
}

async function generateUrlToUpload(packageId) {
    const id = uuid.v4();
    const aws_path = getPackagePostPathOfS3(packageId, id);
    const uploadURL = await S3.uploadFileBySignedURL(aws_path);
    return { id, aws_path, uploadURL };
}

function getPosts(req, res) {
    const { packageId, id } = req.params
    const { limit, page, categoryId } = req.query;
    const where = { package_id: packageId };
    if (id) {
        where.id = id;
    }
    if (categoryId) {
        where.categoryId = categoryId;
    }

    packagePostsRepository.find(where, '*', { limit, page })
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

    packagePostsRepository.create(body)
        .then(() => res.status(201).json(buildMessage('Posts criado com sucesso')))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function deletePost(req, res) {
    const { id, packageId } = req.params;

    packagePostsRepository.findOne({ id, package_id: packageId })
        .then(post => {
            if (!post) {
                throw new Error(`Post[${id}] não encontrado`);
            }

            return packagePostsRepository.deleteById(post.id);
        })
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

    packageRepository.findById(packageId)
        .then(pkg => {
            if (!pkg) {
                throw new Error(`Package[${packageId}] não encontrado`);
            }

            const generateUrls = [];
            for (let i = 0; i < Number(quantity); i++) {
                generateUrls.push(generateUrlToUpload(packageId));
            }

            return Promise.all(generateUrls);
        })
        .then(uploadURLs => res.status(200).json(uploadURLs))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

module.exports = {
    getPosts,
    createPosts,
    deletePost,
    generateUrls
};
