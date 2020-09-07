
exports.up = function(knex) {
    return knex.schema.createTable('Purchase_posts', (table)=>{
        table.increments('id');
        table.integer('package_post_id').unsigned().notNullable();
        table.integer('purchase_id').unsigned().notNullable();
        table.text('aws_path');
        table.timestamps();

        table.foreign('purchase_id').references('Purchases.id');
        table.foreign('package_post_id').references('Package_posts.id');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Purchase_posts');
};
