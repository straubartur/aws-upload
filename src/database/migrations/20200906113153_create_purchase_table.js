
exports.up = function(knex) {
    return knex.schema.createTable('Purchases', (table)=>{
        table.increments('id');
        table.integer('customer_id').notNullable();
        table.integer('campaign_id').notNullable();
        table.boolean('is_paid').notNullable().defaultTo(false);
        table.timestamp('created_at').defaultTo(knex.fn.now());

        table.foreign('customer_id').references('Customers.id')
        table.foreign('campaign_id').references('Campaigns.id')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('Purchases') 
};
