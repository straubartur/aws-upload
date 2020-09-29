/**
 * @typedef { import('./purchase-manager').Purchase } Purchase
 */

/**
 * Check if the purchase is paid
 * @param { Purchase } purchase - The purchase
 * @return { Boolean }
 */
function isPaid (purchase) {
    return purchase.is_paid === 1
}

/**
 * Check if the purchase has AWS Logo
 * @param { Purchase } purchase - The purchase
 * @return { Boolean }
 */
function hasAwsLogo (purchase) {
    return purchase.aws_logo_path !== ''
}

/**
 * Check if the purchase is paid
 * @param { Purchase } purchase - The purchase
 * @return { Boolean }
 */
async function hasPackagePublished (purchase) {
    const PackagesService = require('../services/PackagesService')
    const packagesService = new PackagesService()
    const package = await packagesService.findById(purchase.package_id)
    return package.is_published === 1
}

module.exports = {
    isPaid,
    hasAwsLogo,
    hasPackagePublished
}
