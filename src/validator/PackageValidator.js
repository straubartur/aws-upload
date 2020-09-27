const Joi = require('joi');
const { PackagePost } = require('./PackagePostValidator');

const Package = Joi.object({
    id: Joi.string().guid({version: 'uuidv4'}).required(),
    name: Joi.string().required(),
    description: Joi.string(),
    is_published: Joi.valid(0, 1),
    end_date: Joi.date().iso().allow(null),
    created_at: Joi.date().iso().allow(null),
    updated_at: Joi.date().iso().allow(null),
    is_removed: Joi.valid(0, 1),
    removed_at: Joi.date().iso().allow(null),
    posts: Joi.array().items(PackagePost)
});

module.exports = {
    Package
}
