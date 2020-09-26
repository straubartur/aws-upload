const uuid = require('uuid');
const mime = require('mime-types');
const packagePostsRepository = require('../repositories/PackagePostsRepository');
const S3 = require('../externals/s3');

function savePosts(posts, package_id) {
    return Promise.all(posts.map(post => saveOrCreate(post, package_id)));
}

function saveOrCreate(post, package_id) {
    return findById(post.id, package_id)
        .then((oldPost) => {
            if (!oldPost) {
                return packagePostsRepository.create(post);
            }

            if (post.is_removed) {
                return packagePostsRepository.deleteById(oldPost.id);
            }

            delete post.aws_path;
            delete post.package_id;

            return packagePostsRepository.updateById(oldPost.id, post);
        });
}

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


function getPackagePostPathOfS3(packageId, postId, extension) {
    const ext = extension ? `.${extension}` : '';
    return `packages/${packageId}/posts/${postId}${ext}`;
}

async function generateUrlToPostUpload(packageId, contentType) {
    const id = uuid.v4();
    const aws_path = getPackagePostPathOfS3(packageId, id, mime.extension(contentType));
    const uploadURL = await S3.uploadFileBySignedURL(aws_path);
    return { id, aws_path, uploadURL };
}

module.exports = {
    savePosts,
    create,
    updatePosts,
    updateById,
    deletePosts,
    deleteById,
    find,
    findById,
    generateUrlToPostUpload
};
