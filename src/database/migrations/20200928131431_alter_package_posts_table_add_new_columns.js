
exports.up = function(knex) {
    return knex.schema.table('Package_posts', function (table) {
        table.text('content_type').notNullable();
        table.boolean('is_customizable').notNullable().defaultTo(true);
    });
};

exports.down = function(knex) {
    return knex.schema.table('Package_posts', function (table) {
        table.dropColumn('content_type');
        table.dropColumn('is_customizable');
    });
};
