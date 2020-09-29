
exports.up = function(knex) {
    return knex.schema.alterTable('Purchase_posts', function (table) {
        table.text('watermark_status').defaultTo('pending').alter()
    })
}

exports.down = function(knex) {
    return knex.schema.alterTable('Purchase_posts', function (table) {
        table.text('watermark_status', 7).alter()
    })
}
