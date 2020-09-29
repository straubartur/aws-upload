const BaseRepository = require('./BaseRepository');

class PurchasePostsRepository extends BaseRepository {
    constructor(trx) {
        super('Purchase_posts', trx);
    }

    /**
     * Find posts by watermark status
     * @param { String } purchaseId
     * @param { String } watermarkStatus
     * @return { Promise<import('mysql2').RowDataPacket> }
     */
    findPostsByWatermarkStatus(purchaseId, watermarkStatus) {
        return this.trx('Purchase_posts')
            .leftJoin('Package_posts', 'Purchase_posts.package_post_id', 'Package_posts.id')
            .where({
                'Purchase_posts.purchase_id': purchaseId,
                'Purchase_posts.watermark_status': watermarkStatus,
                'Purchase_posts.is_removed': false,
                'Package_posts.is_removed': false
            })
            .select([
                'Purchase_posts.*',
                'Package_posts.aws_path as aws_path_base',
                'Package_posts.coordinate_x',
                'Package_posts.coordinate_y'
            ]);
    }
}

module.exports = PurchasePostsRepository;
