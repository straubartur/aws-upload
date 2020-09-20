
exports.up = function(knex) {
    return knex.schema.table('Purchases', (table)=>{
        table.uuid('package_id').alter();
        table.uuid('customer_id').alter();
        table.renameColumn('loja_integrada_id', 'loja_integrada_pedido_id');
        table.text('aws_logo_path');
    });
};

exports.down = function(knex) {
    return knex.schema.table('Purchases', (table)=>{
        table.uuid('package_id').notNullable().alter();
        table.uuid('customer_id').notNullable().alter();
        table.renameColumn('loja_integrada_pedido_id', 'loja_integrada_id');
        table.dropColumn('aws_logo_path');
    });
};
