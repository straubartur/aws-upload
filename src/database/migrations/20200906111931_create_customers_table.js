
exports.up = function(knex) {
    return knex.schema.createTable('Customers', (table)=>{
        table.increments('id');
        table.text('name').notNullable();
        table.text('email').notNullable();
        table.text('phone').notNullable();
        table.text('rank').notNullable().defaultTo('Consultora');
        table.text('custom_name');
        table.text('custom_phone');
        table.integer('loja_integrada_id').notNullable().unsigned();
        table.timestamps();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Customers');
};
