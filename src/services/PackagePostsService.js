const uuid = require('uuid');
const mime = require('mime-types');
const S3 = require('../externals/s3');
const PackagePostsRepository = require('../repositories/PackagePostsRepository');

class PackagePostsService extends PackagePostsRepository {
    savePosts(posts, package_id) {
        return Promise.all(posts.map(post => this.saveOrCreate(post, package_id)));
    }

    async saveOrCreate(post, package_id) {
        const oldPost = await this.findById(post.id, package_id)

        if (!oldPost && post.is_removed) {
            return;
        }

        if (!oldPost) {
            return this.create(post);
        }

        if (post.is_removed) {
            return super.deleteById(oldPost.id);
        }

        delete post.aws_path;
        delete post.package_id;

        return super.updateById(oldPost.id, post);
    }

    updatePosts(posts, package_id) {
        return Promise.all(posts.map(post => this.updateById(post.id, post, package_id)));
    }

    async updateById(id, newPost, package_id) {
        const post = await this.findById(id, package_id)

        if (!post) {
            throw new Error(`Post[${id}] não encontrado`);
        }

        delete newPost.aws_path;
        delete newPost.package_id;

        return super.updateById(id, newPost);
    }

    deletePosts(posts, package_id) {
        return Promise.all(posts.map(post => this.deleteById(post.id, package_id)));
    }

    async deleteById(id, package_id) {
        const post = await this.findById(id, package_id)

        if (!post) {
            throw new Error(`Post[${id}] não encontrado`);
        }

        return super.deleteById(id);
    }

    findByPackageId(package_id, select = '*', options = { pagination: false }) {
        return this.find({ package_id }, select, options);
    }

    findById(id, package_id) {
        return this.findOne({ id, package_id });
    }

    getPackagePostPathOfS3(packageId, postId, extension) {
        const ext = extension ? `.${extension}` : '';
        return `packages/${packageId}/posts/${postId}${ext}`;
    }

    async generateUrlToPostUpload(packageId, contentType) {
        const id = uuid.v4();
        const aws_path = this.getPackagePostPathOfS3(packageId, id, mime.extension(contentType));
        const uploadURL = await S3.uploadFileBySignedURL(aws_path);
        return { id, aws_path, uploadURL };
    }
}

module.exports = PackagePostsService;
