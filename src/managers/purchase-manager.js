const PurchasesService = require('../services/PurchasesService')
const PurchasePostsService = require('../services/PurchasePostsSevice')
const PackagesPostsService = require('../services/PackagePostsService')
const { getTransaction } = require('../database/knex');
const rules = require('./purchase-rules')
const watermark = require('../externals/watermark')
const uuid = require('uuid')
const mime = require('mime-types')

/**
 * @typedef { import('../externals/watermark').Purchase } Purchase
 */

/**
 * @typedef { import('../services/PurchasePostsSevice').PurchasePost } PurchasePost
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
 * Create a PurchasePost of Purchase using a PackagePost.
 * @param { Purchase } purchase
 * @param { PackagePost } post
 * @returns { PurchasePost }
 */
function createPurchasePost(purchase, post) {
    const id = uuid.v4()
    let aws_path, aws_path_thumb
    let watermark_status = 'queued'

    if (post.is_customizable) {
        let extension = mime.extension(post.content_type)
        extension = extension ? '.' + extension : ''

        aws_path = `purchases/${purchase.id}/posts/${id}${extension}`
        aws_path_thumb = `purchases/${purchase.id}/posts/thumb-${id}${extension}`
    } else {
        aws_path = post.aws_path
        watermark_status = 'success'
    }

    return {
        id,
        package_post_id: post.id,
        purchase_id: purchase.id,
        content_type: post.content_type,
        aws_path,
        aws_path_thumb,
        watermark_status
    }
}

async function syncPurchasePostsByPackageId(package_id) {
    const PackagesService = require('../services/PackagesService')
    const packagesService = new PackagesService()
    const pkg = await packagesService.findById(package_id)

    if (pkg && pkg.is_published === 1) {
        const purchasesService = new PurchasesService()
        const purchases = await purchasesService.find({ package_id: pkg.id, is_paid: 1 })
        purchases.data.forEach(async purchase => await syncPurchasePosts(purchase))
    }
}

/**
 * Sync the values from Packages_posts to Purchase_posts
 * @param { Purchase } purchase
 * @return { Promise<Boolean> }
 */
async function syncPurchasePosts (purchase) {
    console.log("syncPurchasePosts...")
    const isValid = await validatePurchase(purchase)

    if (!isValid) {
        console.log("Validade false!")
        return false
    }

    const packagesPostsService = new PackagesPostsService()
    const posts = await packagesPostsService.findByPackageId(purchase.package_id)

    if (posts.data && !posts.data.length) {
        console.log("posts vazio! =[")
        return false
    }

    try {
        const trx = await getTransaction()
        const purchasePostsService = new PurchasePostsService(trx)

        const promises = posts.data.map(async (post, i) => {
            const postExists = await existsPurchasePost(purchase.id, post.id)

            if (!postExists) {
                const newPost = createPurchasePost(purchase, post)
                console.log("Create posts", newPost.id)
                return purchasePostsService.create(newPost)
            }

            return Promise.resolve(true)
        })

        await Promise.all(promises)
        await trx.commit()

        setTimeout(watermark.processByPurchase, 0, purchase)

        return true
    } catch (error) {
        console.log(error)
        trx.rollback()
        return false
    }
}

/**
 * Sync the values from Packages_posts to Purchase_posts
 * @param { Purchase } purchase
 * @return { Promise<Boolean> }
 */
async function forceSyncPurchasePosts (purchase) {
    console.log("syncPurchasePosts...")
    const isValid = await validatePurchase(purchase)

    if (!isValid) {
        console.log("Validade false!")
        return false
    }

    const packagesPostsService = new PackagesPostsService()
    const posts = await packagesPostsService.findByPackageId(purchase.package_id)

    if (posts.data && !posts.data.length) {
        console.log("posts vazio! =[")
        return false
    }

    try {
        const trx = await getTransaction()
        const purchasePostsService = new PurchasePostsService(trx)

        const promises = posts.data.map(async (post, i) => {

            const purchasePost = await purchasePostsService.findOne({ purchase_id: purchase.id, package_post_id: post.id })

            if (purchasePost && purchasePost.is_customizable) {
                return purchasePostsService.updateById(purchasePost.id, { watermark_status: 'queued' })
            } else {
                const newPost = createPurchasePost(purchase, post)
                console.log("Create posts", newPost.id)
                return purchasePostsService.create(newPost)
            }
        })

        
        await Promise.all(promises)
        await trx.commit()

        setTimeout(watermark.processByPurchase, 0, purchase)

        return true
    } catch (error) {
        console.log(error)
        trx.rollback()
        return false
    }
}

/**
 * Check if the purchase post exists in database
 * @param { string } purchase_id - The puchase id
 * @param { string } package_post_id - The packagePost id
 * @return { Promise<Boolean> }
 */
async function existsPurchasePost (purchase_id, package_post_id) {
    const purchasePostsService = new PurchasePostsService()
    const post = await purchasePostsService.find({ purchase_id, package_post_id, is_removed: 0 })
    return Boolean(post.data.length)
}

module.exports = {
    validatePurchase,
    syncPurchasePosts,
    forceSyncPurchasePosts,
    syncPurchasePostsByPackageId
}
