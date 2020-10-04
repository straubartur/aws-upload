const Joi = require('joi');

const CustomerValidator = Joi.object({
    id: Joi.string().guid({version: 'uuidv4'}),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().allow(null, ''),
    rank: Joi.string().allow(null, ''),
    custom_name: Joi.string().allow(null, ''),
    custom_phone: Joi.string().allow(null, ''),
    custom_social_media: Joi.string().allow(null, ''),
    custom_image_stamp: Joi.string().required(),
    loja_integrada_cliente_id: Joi.number().integer().allow(null),
    created_at: Joi.date().iso().allow(null),
    updated_at: Joi.date().iso().allow(null),
    is_removed: Joi.valid(0, 1),
    removed_at: Joi.date().iso().allow(null)
});

module.exports = CustomerValidator;
