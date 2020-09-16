const uuid = require('uuid')
const { buildPaginate } = require('../utils/paginationResponse');
const { buildMessage } = require('../utils/buildMessage');
const knex = require('../database/knex');
const PackagePostValidator = require('../validator/PackagePostValidator');
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

class PackagePostsControllers {

    async getPosts(req, res) {
        const { packageId, id } = req.params
        const { limit, page, categoryId } = req.query;

        try {
            const limitNumber = Number(limit || '10');
            const pageNumber = Number(page || '1');
            const offset = (pageNumber - 1) * limitNumber

            const model = () => knex('Package_posts')
                .where('package_id', packageId)
                .andWhere((queryBuilder) => {
                    if(id) {
                        queryBuilder.where('id', id) 
                    }
                    if(categoryId) {
                        queryBuilder.where('category_id', categoryId)
                    }
                    if(packageId) {
                        queryBuilder.where('package_id', packageId)
                    }
                })

            const posts = await model()
                    .limit(limitNumber)
                    .offset(offset)
                    .select('*')

            const paginate = await buildPaginate(pageNumber, model, limitNumber);

            return res.status(200).json({
                data: posts,
                paginate
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json(buildMessage(error.message));
        }
    }

    async createPosts (req, res) {
        try {
            const body = req.body || [];

            const { error } = PackagePostValidator.PackagePostList.validate(body);

            if (error) {
                return res.status(500).json(buildMessage('Ops! Algo deu errado =[', error));
            }

            await knex('Package_posts').insert(body);

            return res.status(200).json(buildMessage('Posts criado com sucesso'));
        } catch (error) {
            console.log(error)
            return res.status(500).json(buildMessage(error.message));
        }
    }

    async deletePost (req, res) {
        try {
            const { packageId, id } = req.params;

            const post = await knex('Package_posts')
                .where({ id, package_id: packageId })
                .first('id', 'aws_path');

            if (!post) {
                throw `Post[${id}] não encontrado`
            }

            console.log('post', post);

            await knex('Package_posts')
                .where('id', id)
                .del()

            S3.deleteObjectByKey(post.aws_path);

            return res.status(204).json(buildMessage('Post deletado com sucesso'));
        } catch (error) {
            console.log(error)
            return res.status(500).json(buildMessage(error.message));
        }
    }

    async generateUrls(req, res) {
        const { packageId, quantity } = req.params;
        const urlQuantity = Number(quantity);

        if (Number.isNaN(urlQuantity) || urlQuantity < 1) {
            return res.status(500).json(buildMessage('Quantidade de URL precisa ser um número maior que 0.'));
        }

        const generateUrls = [];
        for(let i=0; i<Number(quantity); i++) {
            generateUrls.push(generateUrlToUpload(packageId));
        }

        Promise.all(generateUrls)
            .then(uploadURLs => res.status(200).json(uploadURLs))
            .catch(error => {
                console.log(error);
                return res.status(500).json(buildMessage(error.message));
            });
    }
}

module.exports = new PackagePostsControllers();
