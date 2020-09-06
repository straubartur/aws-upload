
exports.up = function(knex) {
    return knex.schema.createTable('Users', (table)=>{
        table.increments('id');
        table.text('name').notNullable();
        table.text('email').notNullable();
        table.text('password').notNullable();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('Users') 
};
