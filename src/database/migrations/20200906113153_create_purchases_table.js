
exports.up = function(knex) {
    return knex.schema.createTable('Purchases', (table)=>{
        table.uuid('id').primary();
        table.uuid('customer_id').notNullable();
        table.uuid('package_id').notNullable();
        table.integer('loja_integrada_id').unsigned().notNullable();
        table.boolean('is_paid').notNullable().defaultTo(false);
        table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
        table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'))

        table.foreign('customer_id').references('Customers.id');
        table.foreign('package_id').references('Packages.id');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Purchases');
};

