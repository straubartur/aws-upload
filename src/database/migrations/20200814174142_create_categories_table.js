exports.up = function(knex) {
    return knex.schema.createTable('Categories', (table)=>{
        table.increments('id');
        table.text('name').notNullable();
        table.text('description');
        table.timestamps()
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('Categories') 
};
