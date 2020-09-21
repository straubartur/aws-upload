const uuid = require('uuid');
const packagePostsRepository = require('../repositories/PackagePostsRepository');
const packagesService = require('./PackagesService');
const S3 = require('../externals/s3');

function create(newPost) {
    return packagePostsRepository.create(newPost);
}

function updateById(id, post) {
    return packagePostsRepository.updateById(id, post);
}

function deleteById(id, package_id) {
    return findById(id, package_id)
        .then((post) => {
            if (!post) {
                throw new Error(`Post[${id}] não encontrado`);
            }

            return packagePostsRepository.deleteById(id);
        });
}

function find(where, select, options) {
    return packagePostsRepository.find(where, select, options);
}

function findById(id, package_id) {
    return packagePostsRepository.findOne({ id, package_id });
}


function getPackagePostPathOfS3(packageId, postId) {
    return `packages/${packageId}/posts/${postId}`;
}

async function generateUrl(packageId) {
    const id = uuid.v4();
    const aws_path = getPackagePostPathOfS3(packageId, id);
    const uploadURL = await S3.uploadFileBySignedURL(aws_path);
    return { id, aws_path, uploadURL };
}

function generateUrlToPostUpload(packageId, quantity) {
    return packagesService.findById(packageId)
        .then(pkg => {
            if (!pkg) {
                throw new Error(`Package[${packageId}] não encontrado`);
            }

            const generateUrls = [];
            for (let i = 0; i < Number(quantity); i++) {
                generateUrls.push(generateUrl(packageId));
            }

            return Promise.all(generateUrls);
        });
}

module.exports = {
    create,
    updateById,
    deleteById,
    find,
    findById,
    generateUrlToPostUpload
};
