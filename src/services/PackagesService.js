const uuid = require('uuid');
const packagesRepository = require('../repositories/PackagesRepository');
const packagePostsService = require('../services/PackagePostsService');

async function save(pkg) {
    const { id, name, description } = pkg;
    const oldPackage = await findById(id);
    if (oldPackage) {
        await updateById(oldPackage.id, { name, description });
    } else {
        await create({ id, name, description });
    }

    await packagePostsService.savePosts(pkg.posts, id);
}

function create(newPackage) {
    delete newPackage.is_published;

    return packagesRepository.create(newPackage)
        .then(() => newPackage);
}

function updateById(id, pkg) {
    delete pkg.is_published;
    return packagesRepository.updateById(id, pkg);
}

function deleteById(id) {
    return packagesRepository.deleteById(id);
}

function find(where, select, options) {
    return packagesRepository.find(where, select, options);
}

function findById(id) {
    return packagesRepository.findById(id)
        .then(async pkg => {
            if (pkg) {
                const { data } = await packagePostsService.find({ package_id: pkg.id }, '*', { pagination: false });
                pkg.posts = data || [];
            }
            return pkg;
        });
}

function publishPackage(id) {
    return packagesRepository.updateById(id, { is_published: true })
        .then(() => {
            // TODO: customizar todos os pacotes comprados!
            // Customizer.AllPurchasesByPackage(pkg);
            // Usar um setTimeout para não travar a resposta.
        });
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
    create,
    updateById,
    deleteById,
    save,
    find,
    findById,
    publishPackage,
    generateUrls
};
