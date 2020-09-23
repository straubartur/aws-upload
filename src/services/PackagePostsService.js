const uuid = require('uuid');
const packagePostsRepository = require('../repositories/PackagePostsRepository');
const packagesService = require('./PackagesService');
const S3 = require('../externals/s3');

function create(newPost) {
    return packagePostsRepository.create(newPost);
}

function updatePosts(posts, package_id) {
    return Promise.all(posts.map(post => updateById(post.id, post, package_id)));
}

function updateById(id, newPost, package_id) {
    return findById(id, package_id)
        .then((post) => {
            if (!post) {
                throw new Error(`Post[${id}] não encontrado`);
            }

            delete newPost.aws_path;
            delete newPost.package_id;

            return packagePostsRepository.updateById(id, newPost);
        });
}

function deletePosts(posts, package_id) {
    return Promise.all(posts.map(post => deleteById(post.id, package_id)));
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

async function generateUrlToPostUpload(packageId) {
    const id = uuid.v4();
    const aws_path = getPackagePostPathOfS3(packageId, id);
    const uploadURL = await S3.uploadFileBySignedURL(aws_path);
    return { id, aws_path, uploadURL };
}

module.exports = {
    create,
    updatePosts,
    updateById,
    deletePosts,
    deleteById,
    find,
    findById,
    generateUrlToPostUpload
};
