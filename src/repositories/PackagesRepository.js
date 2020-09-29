const { knex } = require('../database/knex');

function getModel(trx) {
    return trx('Packages').where('is_removed', false);
}

function create(trx, data) {
    return trx('Packages').insert(data);
}

function updateById(trx, id, data) {
    delete data.id;
    delete data.is_removed;
    delete data.created_at;
    delete data.updated_at;
    delete data.removed_at;

    return getModel(trx).where('id', id).update(data);
}

function update(trx, where = NOOP, data) {
    delete data.id;
    delete data.is_removed;
    delete data.created_at;
    delete data.updated_at;
    delete data.removed_at;

    return getModel(trx).where(where).update(data);
}

function deleteById(trx, id) {
    return getModel(trx).where('id', id).update({is_removed: true, removed_at: knex.fn.now()});
}

function findById(trx, id, select = '*') {
    return getModel(trx).where('id', id).select(select).first();
}

function findOne(trx, where = NOOP, select = '*') {
    return getModel(trx).where(where).select(select).first();
}

async function find(trx, where = NOOP, select = '*', options) {
    const optionsDefault = {
        pagination: true,
        orderBy: [{ column: 'created_at', order: 'desc' }]
    };
    const { pagination, limit, page, orderBy } = {...optionsDefault, ...options};
    const model = () => getModel(trx).where(where);

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

module.exports = {
    create,
    update,
    updateById,
    deleteById,
    findById,
    findOne,
    find
};
