require('dotenv').config()
const axios = require('axios');
const PurchasePostsSevice = require('../services/PurchasePostsSevice')
const PurchasesService = require('../services/PurchasesService')
const { getTransaction } = require('../database/knex')

/**
 * @typedef ProcessorBody
 * @property { String } transactionId
 * @property { String } feedbackUrl
 * @property { String } watermarkPath
 * @property { Array<ImageDetails> } images
 */

/**
 * @typedef ImageDetails
 * @property { ImagePositions } positions
 * @property { String } baseImagePath
 * @property { String } s3ImagePath
 * @property { String } postId
*/

/**
 * @typedef ImagePositions
 * @property { Number } x
 * @property { Number } y
 * @property { Number } height
 * @property { Number } width
 */

/**
 * @typedef URLDetail
 * @property { String } hostname
 * @property { String } protocol
 * @property { Number } port
 * @property { String } pathname
 * @property { String } search
 */

/**
 * @typedef Purchase
 * @property { String } id
 * @property { String } customer_id
 * @property { String } package_id
 * @property { String } loja_integrada_pedido_id
 * @property { 0 | 1 } is_paid
 * @property { 0 | 1 } is_removed
 * @property { Date } cerated_at
 * @property { Date } updated_at
 * @property { Date } removed_at
 * @property { String } custom_name
 * @property { String } custom_phone
 * @property { String } rank
 * @property { String } aws_logo_path
 */

/**
 * @typedef PurchaseItem
 * @property { String } id
 * @property { String } package_id
 * @property { String } aws_path
 * @property { String } coordinate_x
 * @property { String } coordinate_y
 */

/**
 * @param { Purchase } purchase
 * @return { ProcessorBody }
 */
function buildProcessorBody(purchase, items) {
    return {
        transactionId: purchase.id,
        feedbackUrl: process.env.FEEDBACK_URL,
        watermarkPath: purchase.aws_logo_path,
        images: (items || []).map(item => {
            return {
                positions: {
                    x: Number(item.coordinate_x) || 0,
                    y: Number(item.coordinate_y) || 0,
                    height: 150,
                    width: 150
                },
                postId: item.id,
                baseImagePath: item.aws_path_base,
                s3ImagePath: item.aws_path
            }
        })
    }
}

/**
 * Try to performs a request to Image Processor API
 * @param { Array<ProcessorBody> } data
 */
function sendPackageToProcess(data) {
    return axios.post(process.env.IMAGE_PROCESSOR_API, data, {
        headers: { 'Content-Type': 'application/json' }
    });
}

/**
 * Process the images by purchase
 * @param { Purchase } purchase - The puchase Object
 */
async function processByPurchase(purchase) {
    const trx = getTransaction()
    const purchasePostsSevice = new PurchasePostsSevice(trx)
    const purchasesService = new PurchasesService(trx)

    try {
        const posts = await purchasePostsSevice.findPostsByWatermarkStatus(purchase.id, 'queued').data

        if (posts.length) {
            const requestBody = await buildProcessorBody(purchase, posts)
            await sendPackageToProcess([requestBody])

            const updatePostsPromise = posts.map(post => purchasePostsSevice.updateWatermarkStatus(post.id, 'processing'))
            await Promise.all(updatePostsPromise)
            await purchasesService.updateWatermarkStatus(purchase.id, 'processing')
            await trx.commit()
        }
    } catch (error) {
        console.log(error)
        await trx.rollback()
    }
}

module.exports = {
    buildProcessorBody,
    sendPackageToProcess,
    processByPurchase
}
