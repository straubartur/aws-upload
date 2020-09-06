
exports.up = function(knex) {
    return knex.schema.createTable('Campaign_posts', (table)=>{
        table.increments('id');
        table.integer('campaign_post_id').notNullable();
        table.integer('purchase_id').notNullable();
        table.text('aws_path').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());

        table.foreign('purchase_id').references('Purchases.id')
        table.foreign('campaign_post_id').references('Campaign_posts.id')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('Campaign_posts') 
};
