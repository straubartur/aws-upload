const knex = require('../../src/database/knex');
const productFactory = () => {
    async function populateDatabase () {
        const categoryId = await knex('category')
            .insert({
                categoryName: 'Energia',
                categoryVtexId: 3
            })
        const [productId1] = await knex('product')
            .insert({
                productName: 'Fechadura Digital Intelbras FR330',
                productSku: '4527003',
                ean: '7896637680134',
                productRef: '4527003',
                productImage: 'https://lojaintelbras.vteximg.com.br/arquivos/ids/155422/4527003_-_fechadura_digital_fr_330_323143.png?v=637090794948570000',
                productDescription: 'A Fechadura Digital FR 330 é rica em tecnologia, segurança e versátil em suas formas de acesso. Com 4 tipos de acionamento, sendo biometria, senha, adesivo de proximidade e chave física, é utilizada para controle de acesso de casas, apartamentos, escritórios e ambientes comerciais. Aplicada em portas de madeira, possui voice guide que ajuda na confirguração das principais funções e sua alimentação é feita por 8 pilhas AA que acompanham o produto.',
                category_id: categoryId[0],
                detailUrl: 'https://loja.intelbras.com.br/fechadura-digital-fr330/p',
                cubicWeight: 1,
                height: 36,
                weight: 3,
                width: 10,
                length: 31,
                brandId: 2000000,
                specification: '[{"fieldid":21,"fieldname":"Voltagem","fieldvalueids":[63],"fieldvalues":["220V"],"isfilter":true,"fieldgroupid":5,"fieldgroupname":"Dados"},{"fieldid":22,"fieldname":"Central","fieldvalueids":[],"fieldvalues":["Esse produto é teste"],"isfilter":true,"fieldgroupid":5,"fieldgroupname":"Dados"},{"fieldid":23,"fieldname":"Viva Voz","fieldvalueids":[64],"fieldvalues":["Sim"],"isfilter":true,"fieldgroupid":5,"fieldgroupname":"Dados"}]',
                basePrice: 39.6,
                stock:841,
                segmentId: 1,
                agencyActived: 1
            })
        
        const [productId2] =await knex('product')
            .insert({
                productName: 'Kit Roteador Twibi Fast Intelbras',
                productSku: '4674009',
                ean: '7896637682374',
                productRef: '4750071',
                productImage: 'https://lojaintelbras.vteximg.com.br/arquivos/ids/155422/4527003_-_fechadura_digital_fr_330_323143.png?v=637090794948570000',
                productDescription: 'A Fechadura Digital FR 330 é rica em tecnologia, segurança e versátil em suas formas de acesso. Com 4 tipos de acionamento, sendo biometria, senha, adesivo de proximidade e chave física, é utilizada para controle de acesso de casas, apartamentos, escritórios e ambientes comerciais. Aplicada em portas de madeira, possui voice guide que ajuda na confirguração das principais funções e sua alimentação é feita por 8 pilhas AA que acompanham o produto.',
                category_id: categoryId[0],
                detailUrl: 'https://loja.intelbras.com.br/fechadura-digital-fr330/p',
                cubicWeight: 1,
                height: 36,
                weight: 3,
                width: 10,
                length: 31,
                brandId: 2000000,
                specification: '[{"fieldid":21,"fieldname":"Voltagem","fieldvalueids":[63],"fieldvalues":["220V"],"isfilter":true,"fieldgroupid":5,"fieldgroupname":"Dados"},{"fieldid":22,"fieldname":"Central","fieldvalueids":[],"fieldvalues":["Esse produto é teste"],"isfilter":true,"fieldgroupid":5,"fieldgroupname":"Dados"},{"fieldid":23,"fieldname":"Viva Voz","fieldvalueids":[64],"fieldvalues":["Sim"],"isfilter":true,"fieldgroupid":5,"fieldgroupname":"Dados"}]',
                basePrice: 39.6,
                stock:841,
                segmentId: 1,
                agencyActived: 1
            })
        
        const [resellerId1, resellerId2] = await knex('resellers')
            .insert([
                {
                    'resellers_name': 'Plantec Distribuidora ME',
                    'resellers_cnpj': '09262527000169',
                    'resellers_socialName': 'Plantec',
                    'resellers_email': 'rodrigo@plantec.com',
                    'reseller_zipcode': '85602040',
                    'reseller_state': 'PR',
                    'reseller_district': 'Cristo Rei',
                    'reseller_street': 'Rua Sete de Setembro',
                    'reseller_municipality': 'Francisco Beltrão',
                    'reseller_number': '282',
                    'reseller_phone': '48 9999-9999' ,
                    'isactived': '1'
                },
                {
                    'resellers_name': 'arvoretec Distribuidora ME',
                    'resellers_cnpj': '09262527000168',
                    'resellers_socialName': 'Plantec',
                    'resellers_email': 'gentil@arvoretec.com',
                    'reseller_zipcode': '85602040',
                    'reseller_state': 'PR',
                    'reseller_district': 'Cristo Rei',
                    'reseller_street': 'Rua Sete de Setembro',
                    'reseller_municipality': 'Francisco Beltrão',
                    'reseller_number': '282',
                    'reseller_phone': '48 9999-9999' ,
                    'isactived': '1'
                }
            ])
        const [roleId] = await knex('roles')
            .insert({
                roleName: 'adm',
                roleActive: 1
            })

        const [tenantAdressId] = await knex('tenantAddress').insert({
            'streetAddress': `rua das ruas`,
            'stateAddress': `estadp`,
            'zipcodeAddress': `88075110`,
            'sellerId': `15693`
        })

        const [tenantId] = await knex('tenant').insert({
            'sellerId': `15693`,
            'sellerDescription': `um baita de um seller`,
            'sellerShipPolice': `minha venda`,
            'seller_name': `super seller`,
            'isactive': true,
            'exchangeReturnPolicy':`2`,
            'sellerEmail': 'alexandre.chaves@alfast.com.br',
            'addressId': tenantAdressId
        })

        const [userId1, userId2, userId3] = await knex('users')
            .insert([
                {
                    'givenName': 'Rodrigo',
                    'familyName': 'Rodrigues',
                    'email': 'rodrigo@plantec.com',
                    'roleId': roleId,
                    'actived': 1,
                    'tenantId': 0,
                    'isreseller': 1,
                    'resellerId': resellerId1
                },
                {
                    'givenName': 'Fernando fernandes',
                    'familyName': 'Rodrigues',
                    'email': 'gentil@arvoretec.com',
                    'roleId': roleId,
                    'actived': 1,
                    'tenantId': 0,
                    'isreseller': 1,
                    'resellerId': resellerId2
                },
                {
                    'givenName': 'giocondo nascimento',
                    'familyName': 'da silveira',
                    'email': 'alexandre.chaves@alfast.com.br',
                    'roleId': roleId,
                    'actived': 1,
                    'tenantId': tenantId,
                },
            ])

            await knex('tenantConfig').insert({
                'tenantId': tenantId,
                'tokenKey': `${jwt.sign({ foo: 'bar' }, 'name-cnph')}`,
                'tokenId': 'app-token-id-alexandre.chaves-15693256000143',
                'withdrawalsDays': `${sellerWithdrawalsDays}`,
                'commissionTenant': `${commissionPercentage}`,
                'fiscalNumber': `${cnpj}`
            })

            const [segmentId] = await knex('segment')
                .insert({
                    segment_name: 'Segurança Eletronica',
                })
            await knex('segmentToReseller')
                .insert({
                    reseller_id: resellerId1,
                    segment_id: segmentId
                })
            await knex('resellerToSeller')
                .insert({
                    reseller_id: resellerId1,
                    tenant_id: tenantId
                })

            await knex('productByTenant')
                .knex([
                    {
                        tenantId,
                        productId: productId1,
                        priceBase: 100.9,
                        priceSell: 99,
                        stockUnit: 50
                    },
                    {
                        tenantId,
                        productId: productId2,
                        priceBase: 100.9,
                        priceSell: 99,
                        stockUnit: 50
                    }
                ])
            const [status1, status2, status3] = await knex('status')
                .insert([
                    {
                        statusName: 'Recebido'
                    },
                    {
                        statusName: 'Pago'
                    },
                    {
                        statusName: 'Em Separação'
                    }
                ])
            const [orderFormId1, orderFormId2] = await knex('orderForm')
                .knex([
                    {
                        orderToken: 'SAD848AD-asdsad74878817541015AS',
                        tenantId: tenantId,
                        reseller_id: resellerId1,
                        status_id: status1,
                        isactive: 1,
                        orderTotal: 1500,
                        freightModality: 'Economico',
                        freightValue: 15.50
                    },
                    {
                        orderToken: 'SAD848AD-asdsad7487881754adas1015AS',
                        tenantId: tenantId,
                        reseller_id: resellerId1,
                        status_id: status1,
                        isactive: 1,
                        orderTotal: 1500,
                        freightModality: 'Economico',
                        freightValue: 15.50
                    },
                ])
                await knex('orderProducts')
                    .knex([
                        {
                            product_id: productId1,
                            product_qtd: 2,
                            productValue: 750,
                            ordertFormId: orderFormId1,
                            productTotal: 1500
                        },
                        {
                            product_id: productId2,
                            product_qtd: 2,
                            productValue: 750,
                            ordertFormId: orderFormId2,
                            productTotal: 1500
                        },

                    ])

                await knex('orders')
                    .insert({
                        orderNumber: orderFormId1,
                        value: 1500,
                        tenantId: tenantId,
                        totalValue: 1515.5,
                        urlTrackerOrder: 'https://www.someurl.com/pedido',
                        trackerOrderCode: 'ASDAS987953',
                        invoiceKey: 'dasd89737741378',
                        statusId: status2,
                    },
                    {
                        orderNumber: orderFormId2,
                        value: 1500,
                        tenantId: tenantId,
                        totalValue: 1515.5,
                        urlTrackerOrder: 'https://www.someurl.com/pedido',
                        trackerOrderCode: 'ASDAS92187953',
                        invoiceKey: 'dasd8973774137213218',
                        statusId: status3,
                    })
    }

    async function clearDatabase () {
        await knex('orderProducts').truncate()

        await knex('orderForm').truncate()

        await knex('status').truncate()
        
        await knex('productByTenant').truncate()
        
        await knex('resellerToSeller').truncate()
        
        await knex('segmentToReseller').truncate()
        
        await knex('segment').truncate()
        
        await knex('tenantConfig').truncate()

        await knex('users').truncate()

        await knex('tenant').truncate()

        await knex('tenantAddress').truncate()

        await knex('roles').truncate()

        await knex('resellers').truncate()

        await knex('product').truncate()
        
        await knex('category').truncate()

        await knex('status').truncate()

    }

    return {
        populateDatabase,
        clearDatabase
    }
}

module.exports = productFactory();