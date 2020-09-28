const uuid = require('uuid');
const PackageRepository = require('../repositories/PackagesRepository');
const PackagePostsService = require('../services/PackagePostsService');

class PackagesService extends PackageRepository {
    constructor(trx) {
        super(trx);
        this.packagePostsService = new PackagePostsService(this.trx);
    }

    async save({ id, name, description, posts }) {
        const oldPackage = await this.findById(id);
        if (oldPackage) {
            await this.updateById(oldPackage.id, { name, description });
        } else {
            await this.create({ id, name, description });
        }

        await this.packagePostsService.savePosts(posts, id);
    }

    create(newPackage) {
        delete newPackage.is_published;

        return super.create(newPackage)
            .then(() => newPackage);
    }

    updateById(id, pkg) {
        delete pkg.is_published;
        return super.updateById(id, pkg);
    }

    findById(id) {
        return super.findById(id)
            .then(async pkg => {
                if (pkg) {
                    const { data } = await this.packagePostsService.find({ package_id: pkg.id }, '*', { pagination: false });
                    pkg.posts = data || [];
                }
                return pkg;
            });
    }

    publishPackage(id) {
        return super.updateById(id, { is_published: true })
            .then(() => {
                // TODO: customizar todos os pacotes comprados!
                // Customizer.AllPurchasesByPackage(pkg);
                // Usar um setTimeout para não travar a resposta.
            });
    }

    generateUrls(pkgId, contentTypeList) {
        const packageId = pkgId ? pkgId : uuid.v4();

        const generateUrls = contentTypeList.map(contentType => {
            return this.packagePostsService.generateUrlToPostUpload(packageId, contentType['Content-Type']);
        });

        return Promise.all(generateUrls)
            .then(posts => ({ id: packageId, posts }));
    }
}

module.exports = PackagesService;
