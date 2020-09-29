const uuid = require('uuid');
const packageRepository = require('../repositories/PackagesRepository');
// const packagePostsService = require('../services/PackagePostsService');
const { syncPurchasePostsByPackageId } = require('../managers/purchase-manager');


async function save(trx, { id, name, description, posts }) {
    const oldPackage = await findById(trx, id);
    if (oldPackage) {
        await updateById(trx, oldPackage.id, { name, description });
    } else {
        await create(trx, { id, name, description });
    }

    // await packagePostsService.savePosts(trx, posts, id);
}

function create(trx, newPackage) {
    delete newPackage.is_published;

    return packageRepository.create(trx, newPackage)
        .then(() => newPackage);
}

async function updateById(trx, id, pkg) {
    delete pkg.is_published;
    await packageRepository.updateById(trx, id, pkg);
    // setTimeout(syncPurchasePostsByPackageId, 0, id);
}

function findById(trx, id) {
    return packageRepository.findById(trx, id)
    /*
        .then(async pkg => {
            if (pkg) {
                const { data } = await packagePostsService.find(trx, { package_id: pkg.id }, '*', { pagination: false });
                pkg.posts = data || [];
            }
            return pkg;
        });
        */
}

async function publishPackage(trx, id) {
    await packageRepository.updateById(trx, id, { is_published: true })
    setTimeout(syncPurchasePostsByPackageId, 0, id)
}

function generateUrls(pkgId, contentTypeList) {
    const packageId = pkgId ? pkgId : uuid.v4();

    const generateUrls = contentTypeList.map(contentType => {
        return packagePostsService.generateUrlToPostUpload(packageId, contentType['Content-Type']);
    });

    return Promise.all(generateUrls)
        .then(posts => ({ id: packageId, posts }));
}

module.exports = {
    save,
    findById,
    publishPackage,
    generateUrls
};
