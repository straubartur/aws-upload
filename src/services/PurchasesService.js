const uuid = require('uuid');
const PurchasesRepository = require('../repositories/PurchasesRepository');
const CustomersService = require('../services/CustomersService');
const PackagesService = require('../services/PackagesService');
const PurchasePostsService = require('../services/PurchasePostsSevice');
const S3 = require('../externals/s3');
const lojaIntegrada = require('../externals/lojaIntegrada');
const { syncPurchasePosts } = require('../managers/purchase-manager');
const { buildPostResponse } = require('../utils/buildPostResponse');

/**
 * @typedef ProcessorResponse
 * @property { String } transactionId
 * @property { Array<ProcessorResponseImage> } images
 */

/**
 * @typedef ProcessorResponseImage
 * @property { String } postId
 * @property { 'success' | 'error' } status
 */

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

class PurchasesService extends PurchasesRepository {
    constructor(trx) {
        super(trx);
        this.customersService = new CustomersService(this.trx);
        this.packagesService = new PackagesService(this.trx);
    }

    create(purchase) {
        purchase.id = purchase.id || uuid.v4();

        return super.create(purchase)
            .then(() => setTimeout(syncPurchasePosts, 0, purchase));
    }

    updateWatermarkStatus(id, status) {
        return this.updateById(id, { watermark_status: status })
    }

    findByLojaIntegradaPedidoId(loja_integrada_pedido_id) {
        return loja_integrada_pedido_id ? purchasesRepository.findOne({ loja_integrada_pedido_id }) : Promise.resolve();
    }

    getGallery(id) {
        return this.findOne({ id, is_paid: true })
                .then(throwIfNotExist('Compra não encontrada!'))
                .then(async (purchase) => {
                    const groupPosts = await this.getPostsGroupByCategories(purchase.id);
                    const customer = await this.customersService.findById(purchase.customer_id);
                    const pkg = await this.packagesService.findById(purchase.package_id);

                    return {
                        purchase: {
                            id: purchase.id,
                            customer_id: purchase.customer_id,
                            package_id: purchase.package_id,
                            loja_integrada_pedido_id: purchase.loja_integrada_pedido_id,
                        },
                        customer: {
                            id: customer.id,
                            name: customer.name
                        },
                        package: {
                            id: pkg.id,
                            name: pkg.name,
                            description: pkg.description
                        },
                        postsByCategory: groupPosts
                    }
                });
    }

    async getPostsGroupByCategories(purchaseId) {
        const posts = await this.getGalleryPosts(purchaseId)
        const groupPosts = posts.reduce((group, post) => {
            const category = group[post.category_id] || {
                category: {
                    id: post.category_id,
                    name: post.category_name,
                    description: post.category_description
                },
                posts: []
            };

            category.posts.push(buildPostResponse({
                id: post.id,
                aws_path: post.aws_path,
                aws_path_thumb: post.aws_path_thumb
            }));

            group[post.category_id] = category;

            return group;
        }, {});

        return groupPosts;
    }

    getLogoPathOfS3(purchaseId) {
        return `purchases/${purchaseId}/logo.png`;
    }

    async generateUrlToLogoUpload() {
        const id = uuid.v4();
        const aws_logo_path = this.getLogoPathOfS3(id);
        const uploadURL = await S3.uploadFileBySignedURL(aws_logo_path);
        return { id, aws_logo_path, uploadURL };
    }

    createPurchaseWithLogo (newPurchase) {
        return findByLojaIntegradaPedidoId(newPurchase.loja_integrada_pedido_id)
            .then(purchase => throwIfExist(purchase, 'Pedido já cadastrado'))
            .then(async () => {
                await purchasesRepository.create(newPurchase);

                setTimeout(updatePurchaseByLojaIntegrada, 0, newPurchase.loja_integrada_pedido_id);

                return newPurchase;
            });
    }

    createByLojaIntegradaPedido(pedido) {
        // TODO
        return Promise.resolve({
            id: uuid.v4(),
            pedido
        });
    }

    async updatePurchaseByLojaIntegrada(loja_integrada_pedido_id) {
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

    /**
     * Sync status according the processor response
     * @param { ProcessorResponse } response - The processor response
     * @return { Promise }
     * @throws { Error }
     */
    async processingResponse (response) {
        if (
            !response ||
            (response && !response.transactionId) ||
            (response && Array.isArray(response.images) && !response.images.length)
        ) {
            throw new Error('Response inválid')
        }

        let purchaseStatus = 'success'

        const purchasePostsService = new PurchasePostsService(this.trx)
        const promises = response.images.map(async image => {
            if (image.status === 'error') {
                purchaseStatus = 'error'
            }

            return purchasePostsService.updateById(image.postId, {
                watermark_status: image.status
            })
        })

        const promisePurchase = this.updateById(response.transactionId, {
            watermark_status: purchaseStatus
        })

        promises.push(promisePurchase)

        return Promise.all(promises)
            .catch(() => {
                throw new Error('Não foi possível atualizar os status dos posts')
            })
    }
}

module.exports = PurchasesService;
