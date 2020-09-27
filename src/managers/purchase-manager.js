const purchasePostsService = require('../services/PurchasePostsSevice')
const packagesPostsService = require('../services/PackagePostsService')
const rules = require('./purchase-rules')
const watermark = require('../externals/watermark')
const uuid = require('uuid')
const mime = require('mime-types')

/**
 * @typedef { import('../externals/watermark').Purchase } Purchase
 */

/**
 * @typedef DataRule
 * @property { Boolean } isValid
 * @property { Purchase } data
 */

/**
 * Check if the Purchase contains the all steps valid
 * @param { Purchase } purchase
 * @return { Promise<Boolean> }
 */
async function validatePurchase (purchase) {
    const result = await rule({
        isValid: Boolean(purchase),
        data: purchase
    }, () => true)
    .then(data => rule(data, rules.isPaid))
    .then(data => rule(data, rules.hasAwsLogo))
    .then(data => rule(data, rules.hasPackagePublished))

    return result.isValid
}

/**
 * Add a new rule to validate the Purchase
 * @param { DataRule } dataRule - The data processed to the rules
 * @param { Function } fnValidate - The function to validate the rule
 * @return { Promise<DataRule> }
 */
async function rule (dataRule, fnValidate) {
    try {
        if (dataRule.isValid && typeof fnValidate === 'function') {
            dataRule.isValid = Boolean(await fnValidate(dataRule.data))
        }
        return Promise.resolve(dataRule)
    } catch (_) {
        dataRule.isValid = false
        return Promise.resolve(dataRule)
    }
}

/**
 * Sync the values from Packages_posts to Purchase_posts
 * @param { Purchase } purchase
 * @return { Promise<Boolean> }
 */
async function syncPurchasePosts (purchase) {
    const isValid = await validatePurchase(purchase)

    if (!isValid) {
        return false
    }

    const posts = await packagesPostsService.findByPackageId(purchase.package_id)

    if (posts.data && !posts.data.length) {
        return false
    }

    posts.data.forEach(async post => {
        const postExists = await existsPurchasePost(purchase.id, post.id)

        if (!postExists) {
            const id = uuid.v4()
            let extension = mime.extension(mime.lookup(post.aws_path))
            extension = extension ? '.' + extension : ''
            /**
             * @type { import('../services/PurchasePostsSevice').PurchasePost }
             */
            const newPost = {
                id,
                package_post_id: post.id,
                purchase_id: purchase.id,
                aws_path: `purchases/${purchase.id}/posts/${id}${extension}`,
                aws_path_thumb: `purchases/${purchase.id}/posts/thumb-${id}${extension}`,
                watermark_status: '',
                is_removed: 0,
                created_at: new Date()
            }
            await purchasePostsService.create(newPost)
        }
    })

    setTimeout(watermark.processByPurchase, 0, purchase)

    return true
}

/**
 * Check if the purchase post exists in database
 * @param { string } purchase_id - The puchase id
 * @param { string } package_post_id - The packagePost id
 * @return { Promise<Boolean> }
 */
async function existsPurchasePost (purchase_id, package_post_id) {
    const post = await purchasePostsService.find({ purchase_id, package_post_id, is_removed: 0 })
    return Boolean(post.data.length)
}

module.exports = {
    validatePurchase,
    syncPurchasePosts
}