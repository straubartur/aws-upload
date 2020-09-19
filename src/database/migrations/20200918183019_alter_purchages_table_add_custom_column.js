exports.up = function(knex) {
    return knex.schema.table('Purchases', (table)=>{
        table.string('custom_name');
        table.string('custom_phone');
        table.string('rank').notNullable().defaultTo('consultora');
        table.integer('loja_integrada_id').unsigned().alter();
    });
};

exports.down = function(knex) {
    return knex.schema.table('Purchases', (table)=>{
        table.dropColumn('custom_name');
        table.dropColumn('custom_phone');
        table.dropColumn('rank');
        table.integer('loja_integrada_id').unsigned().notNullable().alter();
    });
};
