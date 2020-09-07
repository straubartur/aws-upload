
exports.up = function(knex) {
    return knex.schema.createTable('Packages', (table)=>{
        table.increments('id');
        table.text('name').notNullable();
        table.boolean('is_published').defaultTo(false);
        table.datetime('end_date');
        table.timestamps();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Packages');
};
