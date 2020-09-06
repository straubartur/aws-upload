exports.up = function(knex) {
    return knex.schema.createTable('Categories', (table)=>{
        table.increments('id');
        table.text('name').notNullable();
        table.text('description');
        table.timestamp('created_at').defaultTo(knex.fn.now())
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('Categories') 
};