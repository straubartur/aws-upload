// const PurchasesService = require('../services/PurchasesService')
// const PurchasePostsService = require('../services/PurchasePostsSevice')
// const PackagesPostsService = require('../services/PackagePostsService')


// const { findById } = require('../services/PackagesService');




async function syncPurchasePostsByPackageId(package_id) {
    const { knex } = require('../database/knex');

    const packagesService = require('../services/PackagesService');

    console.log('syncPurchasePostsByPackageId', packagesService);
    // console.log('syncPurchasePostsByPackageId', findById);
    console.log('package_id', package_id);
    // const trx = await getTransaction();
    const pkg = await packagesService.findById(knex, package_id)
    // const pkg = await findById(null, package_id)

    console.log('pkg', pkg);

    if (pkg && pkg.is_published === 1) {
        const purchasesService = new PurchasesService()
        const purchases = await purchasesService.find({ package_id: pkg.id, is_paid: 1 })
        console.log('purchases', purchases)
        purchases.data.forEach(async purchase => await syncPurchasePosts(purchase));
    }
}

module.exports = {
    syncPurchasePostsByPackageId
}
