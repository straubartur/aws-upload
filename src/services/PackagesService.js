const uuid = require('uuid');
const packagesRepository = require('../repositories/PackagesRepository');
const packagePostsService = require('../services/PackagePostsService');

function create(newPackage) {
    newPackage.id = uuid.v4();
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
    return packagesRepository.findById(id);
}

function publishPackage(id) {
    return packagesRepository.updateById(id, { is_published: true })
        .then(() => {
            // TODO: customizar todos os pacotes comprados!
            // Customizer.AllPurchasesByPackage(pkg);
            // Usar um setTimeout para não travar a resposta.
        });
}

function generateUrls(pkgId, quantity) {
    const packageId = pkgId ? pkgId : uuid.v4();
    
    const generateUrls = [];
    for (let i = 0; i < Number(quantity); i++) {
        generateUrls.push(packagePostsService.generateUrlToPostUpload(packageId));
    }

    return Promise.all(generateUrls)
        .then(posts => ({ id: packageId, posts }));
}

module.exports = {
    create,
    updateById,
    deleteById,
    find,
    findById,
    publishPackage,
    generateUrls
};
