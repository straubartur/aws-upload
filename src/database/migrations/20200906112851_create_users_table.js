
exports.up = function(knex) {
    return knex.schema.createTable('Users', (table)=>{
        table.uuid('id').primary();
        table.text('name').notNullable();
        table.text('email').notNullable();
        table.text('password').notNullable();
        table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
        table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'))
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('Users') 
};
