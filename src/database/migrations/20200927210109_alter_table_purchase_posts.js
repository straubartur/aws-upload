
exports.up = function(knex) {
    return knex.schema.table('Purchase_posts', function (table) {
        table.string('watermark_status', 7)
        table.text('aws_path_thumb')
    })
}

exports.down = function(knex) {
    return knex.schema.table('Purchase_posts', function (table) {
        table.dropColumn('watermark_status')
        table.dropColumn('aws_path_thumb')
    })
}
