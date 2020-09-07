
exports.up = function(knex) {
    return knex.schema.createTable('Package_posts', (table) => {
        table.increments('id');
        table.integer('package_id').unsigned().notNullable();
        table.integer('category_id').unsigned().notNullable();
        table.text('name').notNullable();
        table.text('aws_path').notNullable();
        table.text('coordinate_x').notNullable();
        table.text('coordinate_y').notNullable();
        table.timestamps();

        table.foreign('package_id').references('Packages.id');
        table.foreign('category_id').references('Categories.id');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Package_posts');
};
