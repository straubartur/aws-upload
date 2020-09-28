const Joi = require('joi');

const User = Joi.object({
    id: Joi.string().guid({version: 'uuidv4'}),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    created_at: Joi.date().iso().allow(null),
    updated_at: Joi.date().iso().allow(null),
    is_removed: Joi.valid(0, 1),
    removed_at: Joi.date().iso().allow(null)
});

module.exports = { User }
