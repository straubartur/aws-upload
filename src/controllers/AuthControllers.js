const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { buildMessage } = require('../utils/buildMessage');
const UsersService = require('../services/UsersService');
const { getTransaction } = require('../database/knex');
const userValidator = require('../validator/UserValidator')
const saltRounds = 10;

async function login(req, res) {
    const { email, password } = req.body;

    const trx = await getTransaction();
    const usersService = new UsersService(trx);

    usersService.findByEmail(email)
        .then(user => {
            if (!user) {
                return res.status(403).json(buildMessage('Usuário não cadastrado na plataforma'));
            }

            bcrypt.compare(password, user.password, function(err, result) {
                if (err || !result) {
                    return res.status(403).json(buildMessage('Usuário ou senha incorretos'));
                }

                const token =  jwt.sign({ id: user.id }, process.env.AUTH_CONFIG, { expiresIn: 600 })

                return res.status(200).json(buildMessage('Login realizado com sucesso', { token }));
            });
        })
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage('Ops! Algo deu errado =['));
        });
}

async function signUp (req, res) {
    const { name, email, password } = req.body;

    const { error } = userValidator.User.validate(req.body);

    if (error) {
        return res.status(500).json(buildMessage('Ops! Algo deu errado =[', error));
    }

    const trx = await getTransaction();
    const usersService = new UsersService(trx);

    usersService.findByEmail(email)
        .then(user => {
            if (user) {
                return res.status(403).json(buildMessage('E-mail já existe na plataforma'));
            }

            return bcrypt.hash(password, saltRounds);
        })
        .then((hash) => usersService.create({ name, email, password: hash }))
        .then(() => {
            trx.commit();
            res.status(201).json(buildMessage('Usuário cadastrado com sucesso'))
        })
        .catch(error => {
            trx.rollback();
            console.log(error);

            res.status(500).json(buildMessage('Ops! Algo deu errado =['));
        });
}

module.exports = {
    login,
    signUp
};
