
exports.up = function(knex) {
    return knex.schema.alterTable('Purchase_posts', function (table) {
        table.number('watermark_position').notNullable()
    })
}

exports.down = function(knex) {
    return knex.schema.alterTable('Purchase_posts', function (table) {
        table.dropColumn('watermark_position')
    })
}
