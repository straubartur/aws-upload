const PurchasePostsRepository = require('../repositories/PurchasePostsRepository');

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

 class PurchasePostsService extends PurchasePostsRepository {
    /**
     * Find the values of database
     * @param { import('knex').Where } where
     * @param { string } select
     * @param { Object } options
     * @return { Promise<import('mysql2').RowDataPacket> }
     */
    find(where, select = '*', options = { pagination: false }) {
        return super.find(where, select, options)
    }

    updateWatermarkStatus(id, status) {
        return this.updateById(id, { watermark_status: status })
    }
}

module.exports = PurchasePostsService;
