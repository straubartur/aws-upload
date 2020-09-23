const { buildMessage } = require('../utils/buildMessage');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const usersService = require('../services/UsersService');

function login(req, res) {
    const { email, password } = req.body;

    usersService.findByEmail(email)
        .then(user => {
            if (!user) {
                return res.status(403).json(buildMessage('Usuário não cadastrado na plataforma'));
            }

            bcrypt.compare(password, user.password, function(err, result) {
                if (err) {
                    return res.status(403).json(buildMessage('Usuário não cadastrado na plataforma'));
                }

                const token =  jwt.sign({ id: user.id }, process.env.AUTH_CONFIG, { expiresIn: 600 })

                return res.status(200).json(buildMessage('Login realizado com sucesso', { token }));
            });
        })
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

function signUp (req, res) {
    const { name, email, password } = req.body;

    usersService.findByEmail(email)
        .then(user => {
            if (user) {
                return res.status(403).json(buildMessage('E-mail já existe na plataforma'));
            }

            return bcrypt.hash(password, saltRounds);
        })
        .then((hash) => usersService.create({ name, email, password: hash }))
        .then(() => res.status(201).json(buildMessage('Usuário cadastrado com sucesso')))
        .catch(error => {
            console.log(error)
            res.status(500).json(buildMessage(error.message));
        });
}

module.exports = {
    login,
    signUp
};
