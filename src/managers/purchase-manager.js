const purchasePostsService = require('../services/PurchasePostsSevice')
const rules = require('./purchase-rules')

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
async function validatePurchace (purchase) {
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

module.exports = {
    validatePurchace
}