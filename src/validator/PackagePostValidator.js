const Joi = require('joi');

const PackagePost = Joi.object({
    id: Joi.string().guid({version: 'uuidv4'}).required(),
    package_id: Joi.string().guid({version: 'uuidv4'}).required(),
    category_id: Joi.string().guid({version: 'uuidv4'}).required(),
    name: Joi.string().required(),
    content_type: Joi.string().required(),
    is_customizable: Joi.valid(0, 1, false, true),
    aws_path: Joi.string().required(),
    coordinate_x:  Joi.string().required(),
    coordinate_y: Joi.string().required(),
    created_at: Joi.date().iso().allow(null),
    updated_at: Joi.date().iso().allow(null),
    is_removed: Joi.valid(0, 1, false, true),
    removed_at: Joi.date().iso().allow(null)
});

module.exports = {
    PackagePost
}
