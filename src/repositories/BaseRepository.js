const knex = require('../database/knex')

const NOOP = () => {};

class Repository {
    constructor(tableName) {
      this.tableName = tableName;
    }

    getModel() {
        return knex(this.tableName).where('is_removed', false);
    }

    create(data) {
      return knex(this.tableName).insert(data);
    }

    updateById(id, data) {
        return this.getModel().where('id', id).update(data);
    }

    update(where = NOOP, data) {
        return this.getModel().where(where).update(data);
    }

    deleteById(id) {
        return this.getModel().where('id', id).update({is_removed: true});
    }

    findById(id, select = '*') {
        return this.getModel().where('id', id).select(select).first();
    }

    findOne(where = NOOP, select = '*') {
        return this.getModel().where(where).select(select).first();
    }

    async find(where = NOOP, select = '*', options) {
        const optionsDefault = { pagination: true };
        const { pagination, limit, page } = {...optionsDefault, ...options};
        const model = () => this.getModel().where(where);

        if (pagination) {
            const limitPerPage = Number(limit) ? Number(limit) : 10;
            const pageNumber = Number(page) ? Number(page) : 1;
            const offset = (pageNumber - 1) * limitPerPage;
            const data = await model()
                .limit(limitPerPage)
                .offset(offset)
                .select(select);

            const modelCount = await model().count()
            const itensFound = modelCount && modelCount[0] && modelCount[0]['count(*)'];
    
            return {
                data,
                pagination: {
                    page: pageNumber,
                    itensFound: itensFound,
                    totalPages: Math.ceil(itensFound / limitPerPage) || 1
                }
            }
        } else {
            const data = await model().select(select);
            return { data };
        }
    }
}

module.exports = Repository;