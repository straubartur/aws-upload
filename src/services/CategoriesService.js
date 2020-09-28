const uuid = require('uuid');
const CategoriesRepository = require('../repositories/CategoriesRepository');

class CategoriesService extends CategoriesRepository {

    create(newCategory) {
        newCategory.id = uuid.v4();

        return super.create(newCategory)
            .then(() => newCategory);
    }
}

module.exports = CategoriesService;
