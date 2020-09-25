
exports.up = function(knex) {
    return knex.schema.createTable('queue_items', table => {
        table.increments('id').primary()
        table.integer('queue_id').unsigned().notNullable()
        table.string('status', 10).notNullable()
        table.integer('position_x').unsigned().notNullable()
        table.integer('position_y').unsigned().notNullable()
        table.integer('position_height').unsigned().notNullable()
        table.integer('position_width').unsigned().notNullable()
        table.string('base_image_path', 256).notNullable()
        table.string('s3_image_path', 256).notNullable()
        table.text('details')

        table.foreign('queue_id').references('queue.id')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('queue_items')
};
