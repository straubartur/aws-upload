
exports.up = function(knex) {
    return knex.schema.createTable('Packages', (table)=>{
        table.uuid('id').primary();
        table.text('name').notNullable();
        table.boolean('is_published').defaultTo(false);
        table.datetime('end_date');
        table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
        table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'))
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Packages');
};
