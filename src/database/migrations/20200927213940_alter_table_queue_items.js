
exports.up = function(knex) {
    return knex.schema.table('queue_items', function (table) {
        table.uuid('post_id').notNullable()
    })
}

exports.down = function(knex) {
    return knex.schema.table('queue_items', function (table) {
        table.dropColumn('post_id')
    })
}
