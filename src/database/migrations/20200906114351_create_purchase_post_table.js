
exports.up = function(knex) {
    return knex.schema.createTable('Purchase_posts', (table)=>{
        table.increments('id');
        table.integer('campaign_post_id').unsigned().notNullable();
        table.integer('purchase_id').unsigned().notNullable();
        table.text('aws_path');
        table.timestamp('created_at').defaultTo(knex.fn.now());

        table.foreign('purchase_id').references('Purchases.id')
        table.foreign('campaign_post_id').references('Campaign_posts.id')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('Purchase_posts') 
};
