require('dotenv').config()
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/index');
const knex = require('../src/database/index');


describe('order', () => {
    const token = jwt.sign({
        id: 38
    }, process.env.AUTH_CONFIG, { expiresIn: '6000s' })
    let userId;

    afterEach(async () => {
        try {
            await knex('users')
            .del()
            .where('email', '=', 'testmail@test.com')
        } catch (error) {
            console.log(error)
        }
    })

    test('Trazer quantidade de vendas, ticket medio e valor total de receita apenas do parceiro' , () => {
        return request(app)
            .post('/users/add')
            .set('authorization', 'Bearer ' + token)
            .set('app-token-intelbras', process.env.SECRETE_TOKEN_REQUEST)
            .set('Content-Type', 'application/json')
            .send({
                email: 'testmail@test.com',
                username: 'test user',
                subId: '1',
                roleId: '1',
                actived: '2',
                familyName: 'family',
                givenName: 'test',
                tenantId: '12345'
            })
            .then(response => {
                console.log(response.body)
                expect(response.status).toBe(201)
                expect(response.body).toBeDefined();
                expect(response.body).toHaveLength(1);
            })
    })
    test('Traz pedidos com os seguinte campos: Numero pedido, Data, Cliente, Valor, revenda , Status' , () => {

    })

    test('Filtra pedidos por data' , () => {

    })
   
    test('Filtra pedidos por revenda' , () => {

    })

    test('Filtra pedidos por status' , () => {

    })


    test('Filtra por sku' , () => {

    })

    test('ve os detalhes do pedido, ' , () => {

    })

    test('Distribuidora pode aceitar o pedido' , () => {

    })
})

