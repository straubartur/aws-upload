
exports.up = function(knex) {
    return knex.schema.createTable('Customers', (table)=>{
        table.uuid('id').primary();
        table.text('name');
        table.text('email');
        table.text('phone');
        table.text('rank').notNullable().defaultTo('Consultora');
        table.text('custom_name');
        table.text('custom_phone');
        table.integer('loja_integrada_purchase_id').notNullable().unsigned();
        table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
        table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'))
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Customers');
};
