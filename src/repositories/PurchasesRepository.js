const BaseRepository = require('./BaseRepository');
const knex = require('../database/knex');

class PurchasesRepository extends BaseRepository {
    constructor() {
        super('Purchases');
    }

    getGalleryPosts(purchaseId) {
        return knex('Purchase_posts')
            .leftJoin('Package_posts', 'Purchase_posts.package_post_id', 'Package_posts.id')
            .leftJoin('Categories', 'Package_posts.category_id', 'Categories.id')
            .where({
                'Purchase_posts.purchase_id': purchaseId,
                'Purchase_posts.is_removed': false,
                'Package_posts.is_removed': false,
                'Categories.is_removed': false,
            })
            .select('Categories.id as category_id', 'Categories.name as category_name', 'Purchase_posts.*');
    }
}

module.exports = new PurchasesRepository();
