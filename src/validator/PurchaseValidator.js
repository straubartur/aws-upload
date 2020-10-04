const Joi = require('joi');

const PurchaseValidator = Joi.object({
    id: Joi.string().guid({version: 'uuidv4'}),
    customer_id: Joi.string().guid({version: 'uuidv4'}).required(),
    package_id: Joi.string().guid({version: 'uuidv4'}).required(),
    loja_integrada_pedido_id: Joi.number().integer(),
    is_paid: Joi.valid(0, 1, false, true),
    custom_name: Joi.string().required(),
    custom_phone: Joi.string().required(),
    custom_social_media: Joi.string().allow(null, ''),
    custom_image_stamp: Joi.string().required(),
    rank: Joi.string().allow(null, ''),
    aws_logo_path: Joi.string().required(),
    watermark_status: Joi.string(),
    created_at: Joi.date().iso().allow(null),
    updated_at: Joi.date().iso().allow(null),
    is_removed: Joi.valid(0, 1, false, true),
    removed_at: Joi.date().iso().allow(null)
});

module.exports = PurchaseValidator;
