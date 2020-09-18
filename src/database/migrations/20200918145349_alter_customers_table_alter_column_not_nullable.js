exports.up = function(knex) {
    return knex.schema.table('Customers', (table)=>{
        table.text('name').notNullable().alter();
        table.string('email').notNullable().unique().alter();
        table.dropColumn('loja_integrada_purchase_id');
        table.integer('loja_integrada_id').unique().unsigned();
    });
};

exports.down = function(knex) {
    return knex.schema.alterTable('Customers', table => {
            table.dropUnique('email');
            table.dropUnique('loja_integrada_id');
        })
        .then(() => {
            return knex.schema.alterTable('Customers', table => {
                table.text('name').alter();
                table.text('email').alter();
                table.dropColumn('loja_integrada_id');
                table.integer('loja_integrada_purchase_id').notNullable().unsigned();
            });
        });
};
