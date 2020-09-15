const uuid = require('uuid')
const knex = require('../database/knex');
const PackagePostValidator = require('../validator/PackagePostValidator');
const S3 = require('../services/s3')

function getPackagePostPathOfS3(packageId, postId) {
    return `/packages/${packageId}/posts/${postId}`;
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


            const postsCount = await model()
                .count();
    
            const postsCountN = postsCount[0]
                && postsCount[0]['count(*)']
        
            const paginate = [{
                'page': pageNumber, 
                'itensFound' : postsCountN,
                'totalPages': Math.ceil(postsCountN / limitNumber) || 1
            }]

            return res.status(200).json({
                data: posts,
                paginate
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error.message
            }) 
        }
    }

    async createPosts (req, res) {
        try {
            // const { packageId } = req.params;
            const body = req.body || [];

            const { error } = PackagePostValidator.PackagePostList.validate(body);

            if (error) {
                return res.status(500).json({
                    message: 'Ops! Algo deu errado =[',
                    error
                });
            }

            await knex('Package_posts').insert(body);

            return res.status(200).json({
                message: 'Posts criado com sucesso'
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error
            }) 
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

            return res.status(200).json({
                message: 'Post deletada com sucesso',
                post
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error
            }) 
        }
    }

    async generateUrls(req, res) {
        const { packageId, quantity } = req.params;
        const urlQuantity = Number(quantity);

        if (Number.isNaN(urlQuantity) || urlQuantity < 1) {
            return res.status(500).json({
                message: 'Quantidade de URL precisa ser um número maior que 0.'
            });
        }

        const generateUrls = [];
        for(let i=0; i<Number(quantity); i++) {
            generateUrls.push(generateUrlToUpload(packageId));
        }

        Promise.all(generateUrls)
            .then(uploadURLs => res.status(200).json(uploadURLs))
            .catch(error => {
                console.log(error);
                return res.status(500).json({
                    message: error
                }) 
            });
    }
}

module.exports = new PackagePostsControllers();
