const BaseRepository = require('./BaseRepository');

class PurchasesRepository extends BaseRepository {
    constructor(trx) {
        super('Purchases', trx);
    }

    getGalleryPosts(purchaseId) {
        return this.trx('Purchase_posts')
            .leftJoin('Package_posts', 'Purchase_posts.package_post_id', 'Package_posts.id')
            .leftJoin('Categories', 'Package_posts.category_id', 'Categories.id')
            .where({
                'Purchase_posts.purchase_id': purchaseId,
                'Purchase_posts.is_removed': false,
                'Package_posts.is_removed': false,
                'Categories.is_removed': false,
            })
            .select([
                'Categories.id as category_id',
                'Categories.name as category_name',
                'Categories.description as category_description',
                'Purchase_posts.*'
            ]);
    }
}

module.exports = new PurchasesRepository();
