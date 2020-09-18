const Joi = require('joi');

const PackagePost = Joi.object({
    id: Joi.string().guid({version: 'uuidv4'}).required(),
    package_id: Joi.string().guid({version: 'uuidv4'}).required(),
    category_id: Joi.string().guid({version: 'uuidv4'}).required(),
    name: Joi.string().required(),
    aws_path: Joi.string().required(),
    coordinate_x:  Joi.string().required(),
    coordinate_y: Joi.string().required()
});

const PackagePostList = Joi.array().items(PackagePost).min(1);

module.exports = {
    PackagePost,
    PackagePostList
}
