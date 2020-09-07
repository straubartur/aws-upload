const knex = require('../database/knex')

function imageStream (req, res, callback) {
    let fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', async function (fieldname, file, filename) {
        req.setTimeout(50000);
        if(!(/\.(png|jpg)/.test(filename))) {
            return res.status(400)
                .json({
                    message: 'Por favor insira um arquivo no formato permitido'
                })
        }

        console.log("Uploading: " + filename); 
        fstream = fs.createWriteStream(__dirname + '/../files/' + filename);

        file.pipe(fstream);
        fstream.on('close', function () {
            callback(fstream.path);
        });
    });
}

function calculateXPosition (position, file) {
    return 10;
}

function calculateYPosition (position, file) {
    return 10;
}
class CampaginsControllers {
    async getPosts(req, res) {
        const { id } = req.params
        const { date, limit, page, campaignId, postCategoryId } = req.query;
        try {
            const limitNumber = Number(limit || '10');
            const pageNumber = Number(page || '1');
            const offset = (pageNumber - 1) * limitNumber

            const model = () => knex('Campaign_posts')
                .where('campaign_id', campaignId)
                .andWhere((queryBuilder) => {
                    if (date) {
                        queryBuilder.where('Campaign_posts.createdAt', '>=', date)
                    }
                    if(id) {
                        queryBuilder.where('id', id) 
                    }
                    if(postCategoryId) {
                        queryBuilder.where('post_category_id', postCategoryId)
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
                'totalPages': Math.ceil(postsCountN / limitNumber)
            }]

            return res.status(200).json({
                data: posts,
                paginate
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error
            }) 
        }
    }

    async updatePosts (req, res) {
        try {
            const { id } = req.params;
            const {
                name,
                postCategoryId,
                campaignId,
                position
            } = req.body;

            imageStream(req, res, async (imagePath) => {

                // save image to aws
                // retrieve path
                await knex('Campaign_posts')
                    .where('id', id)
                    .update({
                        ...name && {
                            name
                        },
                        ...awsPath && {
                            aws_path: awsPath
                        },
                        ...coordinateX && {
                            coordinate_x: coordinateX
                        },
                        ...coordinateY && {
                            coordinate_y: coordinateY
                        },
                        ...postCategoryId && {
                            post_category_ud: postCategoryId
                        },
                        ...campaignId && {
                            campaign_id: campaignId
                        } 
                    })


                return res.status(204).json({
                    message: 'campanha modificada com sucesso',
                    id
                })
            })
            
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error
            }) 
        }
    }

    async createPosts (req, res) {
        try {
            const {
                name,
                awsPath,
                postCategoryId,
                campaignId,
                position,
                file
            } = req.body;

            if(!name) res.send(400).json({ message: 'O nome é um atributo obrtigatório'})
            if(!postCategoryId) res.send(400).json({ message: 'O id de categoria é um atributo obrtigatório'});
            if(!campaignId) res.send(400).json({ message: 'O id de campanha é um atributo obrtigatório'});
            if(!position) res.send(400).json({ message: 'O id de campanha é um atributo obrtigatório'});

            imageStream(req, res, async (imagePath) => {
                const coordinateX = calculateXPosition(position, file);
                const coordinateY = calculateYPosition(position, file);
                // save image to aws
                // retrieve path
                await knex('Campaign_posts')
                    .where('id', id)
                    .save({
                        ...name && {
                            name
                        },
                        ...awsPath && {
                            aws_path: awsPath
                        },
                        ...coordinateX && {
                            coordinate_x: coordinateX
                        },
                        ...coordinateY && {
                            coordinate_y: coordinateY
                        },
                        ...postCategoryId && {
                            post_category_ud: postCategoryId
                        },
                        ...campaignId && {
                            campaign_id: campaignId
                        } 
                    })


                return res.status(204).json({
                    message: 'campanha criada com sucesso',
                    id
                })
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error
            }) 
        }
    }

    async deletePosts (req, res) {
        try {
            const { id } = req.params;

            await knex('Campaign_posts')
                .where('id', id)
                .del()

            return res.status(204).json({
                message: 'campanha deletada com sucesso',
                id
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error
            }) 
        }
    }
}   


module.exports = new CampaginsControllers();