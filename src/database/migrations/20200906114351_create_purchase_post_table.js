
exports.up = function(knex) {
    return knex.schema.createTable('Purchase_posts', (table)=>{
        table.uuid('id').primary();
        table.uuid('package_post_id').notNullable();
        table.uuid('purchase_id').notNullable();
        table.text('aws_path');
        table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
        table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'))

        table.foreign('purchase_id').references('Purchases.id');
        table.foreign('package_post_id').references('Package_posts.id');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Purchase_posts');
};
