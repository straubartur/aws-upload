const packagesRepository = require('../repositories/PackagesRepository');
const uuid = require('uuid');

function create(newPackage) {
    newPackage.id = uuid.v4();
    delete pkg.is_published;

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

module.exports = {
    create,
    updateById,
    deleteById,
    find,
    findById,
    publishPackage
};
