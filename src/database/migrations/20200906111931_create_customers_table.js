
exports.up = function(knex) {
    return knex.schema.createTable('Customers', (table)=>{
        table.increments('id');
        table.text('name');
        table.text('email');
        table.text('phone');
        table.text('rank').notNullable().defaultTo('Consultora');
        table.text('custom_name');
        table.text('custom_phone');
        table.integer('loja_integrada_purchase_id').notNullable().unsigned();
        table.timestamps();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Customers');
};
