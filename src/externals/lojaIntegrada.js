const axios = require('axios');

const PURCHASES_URL = (query) => `https://api.awsli.com.br/v1/pedido/search/${query}`;
const PURCHASE_DETAIL_URL = (pedido_id) => `https://api.awsli.com.br/v1/pedido/${pedido_id}`;
const CLIENTE_URL = (cliente_id) => `https://api.awsli.com.br/v1/cliente/${cliente_id}`;

const getRequest = (url) => axios.get(url, {
        headers: {
            'Content-Type': 'application/json' 
        }
    });

/**
 * Parse a object to a string with the url params
 * @param { URL } baseUrl valid base URL
 * @param { Object } params Object with url params
 * @returns { String }
 */
function buildParams(params) {
    return Object.keys(params).reduce(function (query, key) {
        query.push(key + '=' + params[key]);
        return query;
    }, []).join('&');
}

async function getLatestPedidos(params) {
    const newPurchases = await axios.get(PURCHASES_URL(buildParams(params)), {
        headers: { 'Content-Type': 'application/json' }
    });

    console.log(newPurchases);

    return newPurchases;

    // newPurchases.forEach(purchase => addNewPurchase(purchase.id));
}

function getPedidoDetail(pedidoId) {
    return getRequest(PURCHASE_DETAIL_URL(pedidoId))
        .then(response => response)
        .catch((error) => {
            console.error('Loja Integrada Request Error[url]: ', PURCHASE_DETAIL_URL(pedidoId));
            console.error('Loja Integrada Request Error: ', error.message);
            throw error;
        });
}

async function getClienteById(clienteId) {
    const lastPurchase = await knex('Purchases')
        .limit(1)
        .orderBy('id', 'desc')
        .first()
    
    const newPurchases = await axios.get(`${PURCHASES_URL}since_numero=${lastPurchase}`, {
        headers: {
            'Content-Type': 'application/json' 
        }
    });

    // newPurchases.forEach(purchase => addNewPurchase(purchase.id));
}

module.exports = {
    getPedidoDetail
}
