const Joi = require('joi');

const Auth = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

module.exports = { Auth }
