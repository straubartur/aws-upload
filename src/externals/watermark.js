require('dotenv').config()
const http = require('http')
const mime = require('mime-types')
const PackagePostsService = require('../services/PackagePostsService')

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
async function buildProcessorBody(purchase) {
    const packagePostsService = new PackagePostsService()
    /**
     * @type { Array<PurchaseItem> }
     */
    const items = await packagePostsService.find({ package_id: purchase.package_id, is_customizable: true }).data

    return {
        transactionId: purchase.id,
        feedbackUrl: process.env.FEEDBACK_URL,
        watermarkPath: purchase.aws_logo_path,
        images: (items || []).map(item => {
            let extension = mime.extension(item.content_type)
            extension = extension ? '.' + extension : ''

            return {
                positions: {
                    x: Number(item.coordinate_x) || 0,
                    y: Number(item.coordinate_y) || 0,
                    height: 150,
                    width: 150
                },
                postId: item.id,
                baseImagePath: item.aws_path,
                s3ImagePath: `purchases/${purchase.id}/posts/${item.id}${extension}`
            }
        })
    }
}

/**
 * Try to performs a request to Image Processor API
 * @param { Array<ProcessorBody> } data
 */
function sendPackageToProcess(data) {
    const body = JSON.stringify(data)
    const urlDetails = getUrlDetails(process.env.IMAGE_PROCESSOR_API)
    const options = {
        hostname: urlDetails.hostname,
        port: urlDetails.port,
        path: `${urlDetails.pathname}${urlDetails.search}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': body.length
        }
    }

    const req = http.request(options)

    req.on('error', error => console.log('Error: could not be fire a request', error))
    req.write(body)
    req.end()
}

/**
 * Returns the details from URL
 * @param { string } url - The URL
 * @return { URLDetail }
 */
function getUrlDetails(url) {
    if (!url || typeof url !== 'string') {
        return
    }

    const { hostname, protocol, port, pathname, search } = new URL(url)

    return {
        hostname,
        protocol,
        port: Number(port) || 80,
        pathname,
        search
    }
}

/**
 * Process the images by purchase
 * @param { Purchase } purchase - The puchase Object
 */
async function processByPurchase(purchase) {
    const requestBody = await buildProcessorBody(purchase)
    sendPackageToProcess([requestBody])
}

module.exports = {
    buildProcessorBody,
    sendPackageToProcess,
    processByPurchase
}
