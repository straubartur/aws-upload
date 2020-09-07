const knex = require('../database/knex')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const saltRounds = 10;

class AuthController {
    async login(req, res) {
        const { email, password } = req.query;
        try {
            const user = await knex('users')
                .where({
                    email
                })
                .first();
            
            if(!user) {
                return res.status(403).json({
                    message: 'Usuário não cadastrado na plataforma'
                })
            }

            bcrypt.compare(password, user.password, function(err, result) {
               if(err) {
                    return res.status(403).json({
                        message: 'Usuário não cadastrado na plataforma'
                    })
               }

               const token =  jwt.sign({ id: user.id }, process.env.AUTH_CONFIG, { expiresIn: 600 })

               return res.status(201).json({
                   message: 'Login realizado com sucesso',
                   token
               })
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error
            }) 
        }
    }

    async signUp () {
        const { name, email, password } = req.query;
        try {
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                await knex('users')
                    .insert({ 
                        name,
                        email,
                        password: hash 
                    });
                return res.status(201).json({
                    message: 'Usuário cadastrado com sucesso'
                })
            })
            
        } catch (error) {
            return res.status(500).json({
                message: error
            }) 
        }
    }
}  


module.exports = new AuthController();