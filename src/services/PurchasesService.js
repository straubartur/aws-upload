const purchasesRepository = require('../repositories/PurchasesRepository');
const customersService = require('../services/CustomersService');
const S3 = require('../externals/s3');
const lojaIntegrada = require('../externals/lojaIntegrada');
const uuid = require('uuid');

function throwIfExist(message) {
    return (result) => {
        if (result) {
            throw new Error(message);
        }

        return result;
    }
}

function throwIfNotExist(message) {
    return (result) => {
        if (!result) {
            throw new Error(message);
        }

        return result;
    }
}

function create(purchase) {
    purchase.id = uuid.v4();

    return purchasesRepository.create(purchase)
        .then(() => {
            // TODO: If package is published
            // Customizer.PurchaseById(purchase);
            // Use setTimeout ou nextTick para não parar o fluxo de criação
        });
}

function updateById(id, purchase) {
    return purchasesRepository.updateById(id, purchase);
}

function deleteById(id) {
    return purchasesRepository.deleteById(id);
}

function find(where, select, options) {
    return purchasesRepository.find(where, select, options);
}

function findByLojaIntegradaPedidoId(loja_integrada_pedido_id) {
    return loja_integrada_pedido_id ? purchasesRepository.findOne({ loja_integrada_pedido_id }) : Promise.resolve();
}

function getGallery(id) {
    return purchasesRepository.find({ id, is_paid: true })
            .then(throwIfNotExist('Compra não encontrada!'))
            .then(async (purchase) => {
                const posts = await purchasesRepository.getGalleryPosts(purchase.id)

                return {
                    purchase,
                    posts
                }
            });
}

function getLogoPathOfS3(purchaseId) {
    return `purchases/${purchaseId}/logo.png`;
}

async function generateUrlToLogoUpload() {
    const id = uuid.v4();
    const aws_logo_path = getLogoPathOfS3(id);
    const uploadURL = await S3.uploadFileBySignedURL(aws_logo_path);
    return { id, aws_logo_path, uploadURL };
}

function createPurchaseWithLogo (newPurchase) {
    return findByLojaIntegradaPedidoId(newPurchase.loja_integrada_pedido_id)
        .then(purchase => throwIfExist(purchase, 'Pedido já cadastrado'))
        .then(async () => {
            await purchasesRepository.create(newPurchase);

            setTimeout(updatePurchaseByLojaIntegrada, 0, newPurchase.loja_integrada_pedido_id);

            return newPurchase;
        });
}

function createByLojaIntegradaPedido(pedido) {
    // TODO
    return Promise.resolve({
        id: uuid.v4(),
        pedido
    });
}

async function updatePurchaseByLojaIntegrada(loja_integrada_pedido_id) {
    try {
        const pedido = await lojaIntegrada.getPedidoDetail(loja_integrada_pedido_id);
        let purchase = await purchasesRepository.find({ loja_integrada_pedido_id });
        let customer = await customersService.find({ loja_integrada_cliente_id: pedido.cliente.id });
        let custom_info;

        if (purchase) {
            custom_info = {
                aws_logo_path: purchase.aws_logo_path,
                custom_name: purchase.custom_name,
                custom_phone: purchase.custom_phone,
                rank: purchase.rank,
            }
        }

        if (!customer) {
            customer = await customersService.createByLojaIntegradaCliente(pedido.cliente, custom_info);
        }

        if (!purchase) {
            purchase = await createByLojaIntegradaPedido(pedido, customer);
        } else {
            customersService.updateLojaIntegradaInfo(customer.id, {
                name: pedido.nome,
                cellphone: pedido.telefone_celular,
                phone: pedido.telefone_principal,
            }, custom_info);

            purchasesRepository.updateById(purchase.id, { customer_id: customer.id });
        }

        // TODO: If package is published
        // Customizer.PurchaseById(purchase);
    } catch (error) {
        console.error('Não foi possível atualizar o cliente do Pedido!');
        console.error(error);
        throw error;
    }
}

module.exports = {
    create,
    updateById,
    deleteById,
    find,
    getGallery,
    generateUrlToLogoUpload,
    createPurchaseWithLogo
};
