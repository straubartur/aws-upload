
exports.up = function(knex) {
    return knex.schema.alterTable('Package_posts', function (table) {
        table.integer('watermark_position').notNullable()
    })
}

exports.down = function(knex) {
    return knex.schema.alterTable('Package_posts', function (table) {
        table.dropColumn('watermark_position')
    })
}
