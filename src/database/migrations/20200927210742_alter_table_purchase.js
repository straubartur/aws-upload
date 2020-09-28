
exports.up = function(knex) {
    return knex.schema.table('Purchases', function (table) {
        table.string('watermark_status', 7)
    })
}

exports.down = function(knex) {
    return knex.schema.table('Purchases', function (table) {
        table.dropColumn('watermark_status')
    })
}
