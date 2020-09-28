
exports.up = function(knex) {
    return knex.schema.table('Purchase_posts', function (table) {
        table.text('content_type').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.table('Purchase_posts', function (table) {
        table.dropColumn('content_type');
    });
};
