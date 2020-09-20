
exports.up = function(knex) {
    return knex.schema.alterTable('Customers', table => {
        table.dropUnique('loja_integrada_id');
    })
    .then(() => knex.schema.alterTable('Customers', table => {
        table.renameColumn('loja_integrada_id', 'loja_integrada_cliente_id');
    }))
    .then(() => knex.schema.alterTable('Customers', table => {
        table.unique('loja_integrada_cliente_id');
    }));
};

exports.down = function(knex) {
    return knex.schema.alterTable('Customers', table => {
        table.dropUnique('loja_integrada_cliente_id');
    })
    .then(() => knex.schema.alterTable('Customers', table => {
        table.renameColumn('loja_integrada_cliente_id', 'loja_integrada_id');
    }))
    .then(() => knex.schema.alterTable('Customers', table => {
        table.unique('loja_integrada_id');
    }));
};
