
exports.up = function(knex) {
  return knex.schema.alterTable('Packages', function (table) {
        table.text('description');
    });
};

exports.down = function(knex) {
    return knex.schema.alterTable('Packages', function (table) {
        table.dropColumn('description');
    });
};
