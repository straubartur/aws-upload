
exports.up = function(knex) {
    return knex.schema.table('Customers', function (table) {
        table.boolean('is_removed').notNullable().defaultTo(false);
        table.dateTime('removed_at');
    });
};

exports.down = function(knex) {
    return knex.schema.table('Customers', function (table) {
        table.dropColumn('is_removed');
        table.dropColumn('removed_at');
    });
};
