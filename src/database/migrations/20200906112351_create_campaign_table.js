
exports.up = function(knex) {
    return knex.schema.createTable('Campaigns', (table)=>{
        table.increments('id');
        table.text('name').notNullable();
        table.integer('is_published').defaultTo(false)
        table.timestamp('created_at').defaultTo(knex.fn.now())
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('Campaigns') 
};
