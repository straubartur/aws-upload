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
        delete data.id;
        delete data.is_removed;
        delete data.created_at;
        delete data.updated_at;
        delete data.removed_at;

        return this.getModel().where('id', id).update(data);
    }

    update(where = NOOP, data) {
        delete data.id;
        delete data.is_removed;
        delete data.created_at;
        delete data.updated_at;
        delete data.removed_at;

        return this.getModel().where(where).update(data);
    }

    deleteById(id) {
        return this.getModel().where('id', id).update({is_removed: true, removed_at: knex.fn.now()});
    }

    findById(id, select = '*') {
        return this.getModel().where('id', id).select(select).first();
    }

    findOne(where = NOOP, select = '*') {
        return this.getModel().where(where).select(select).first();
    }

    async find(where = NOOP, select = '*', options) {
        const optionsDefault = {
            pagination: true,
            orderBy: [{ column: 'created_at', order: 'desc' }]
        };
        const { pagination, limit, page, orderBy } = {...optionsDefault, ...options};
        const model = () => this.getModel().where(where);

        if (pagination) {
            const limitPerPage = Number(limit) ? Number(limit) : 10;
            const pageNumber = Number(page) ? Number(page) : 1;
            const offset = (pageNumber - 1) * limitPerPage;
            const data = await model()
                .limit(limitPerPage)
                .offset(offset)
                .select(select)
                .orderBy(orderBy);

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
            const data = await model().select(select).orderBy(orderBy);
            return { data };
        }
    }
}

module.exports = Repository;
