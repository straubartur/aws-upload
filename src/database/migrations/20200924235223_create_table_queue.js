
exports.up = function(knex) {
    return knex.schema.createTable('queue', table => {
        table.increments('id').primary()
        table.string('status', 10).notNullable()
        table.string('transaction_id', 45).notNullable()
        table.string('feedback_url', 256).notNullable()
        table.string('watermark_path', 256).notNullable()
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('queue')
};
