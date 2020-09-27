const purchasePostsRepository = require('../repositories/PackagePostsRepository')

/**
 * @typedef PurchasePost
 * @property { String } id
 * @property { String } package_post_id
 * @property { String } purchase_id
 * @property { String } aws_path
 * @property { String } aws_path_thumb
 * @property { 'error' | 'success' } watermark_status
 * @property { 0 | 1 } is_removed
 * @property { Date } created_at
 * @property { Date } updated_at
 * @property { Date } removed_at
 */

/**
 * Find the values o dabase
 * @param { import('knex').Where } where
 * @param { string } select
 * @param { Object } options
 * @return { Promise<import('mysql2').RowDataPacket> }
 */
function find(where, select = '*', options = { pagination: false }) {
    return purchasePostsRepository.find(where, select, options)
}

/**
 * @param { PurchasePost } newPost
 * @return { import('knex').QueryBuilder<TRecord, TResult2> }
 */
function create(newPost) {
    return purchasePostsRepository.create(newPost);
}

module.exports = {
    find,
    create
}
