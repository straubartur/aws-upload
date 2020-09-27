/**
 * @typedef { import('./purchase-manager').DataRule } DataRule
 */

/**
 * Just test
 * @param { DataRule } rule - The data rule value
 * @return { Boolean }
 */
function testParaOGege (rule) {
    return rule.data.id === 'test'
}

module.exports = {
    testParaOGege
}
