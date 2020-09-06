
exports.up = function(knex) {
    return knex.schema.createTable('Campaign_posts', (table)=>{
        table.increments('id');
        table.integer('campaign_id').notNullable();
        table.integer('post_category_id').notNullable();
        table.text('name').notNullable();
        table.text('aws_path').notNullable();
        table.text('coordinate_x').notNullable();
        table.text('coordinate_y').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());

        table.foreign('campaign_id').references('Campaigns.id')
        table.foreign('post_category_id').references('Categories.id')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('Campaign_posts') 
};
