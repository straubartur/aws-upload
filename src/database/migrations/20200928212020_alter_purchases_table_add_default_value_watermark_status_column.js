
exports.up = function(knex) {
    return knex.schema.alterTable('Purchases', function (table) {
        table.string('watermark_status').defaultTo('pending').alter()
    })
}

exports.down = function(knex) {
    return knex.schema.alterTable('Purchases', function (table) {
        table.string('watermark_status', 7).alter()
    })
}
