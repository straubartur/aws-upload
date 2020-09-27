
exports.up = function(knex) {
    return knex.schema.createTable('Package_posts', (table) => {
        table.uuid('id').primary();
        table.uuid('package_id').notNullable();
        table.uuid('category_id').notNullable();
        table.text('name').notNullable();
        table.string('watermark_status', 7)
        table.text('aws_path').notNullable();
        table.text('coordinate_x').notNullable();
        table.text('coordinate_y').notNullable();
        table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
        table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'))

        table.foreign('package_id').references('Packages.id');
        table.foreign('category_id').references('Categories.id');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Package_posts');
};
