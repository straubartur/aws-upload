
exports.up = function(knex) {
    return knex.schema.alterTable('Customers', function (table) {
        table.string('custom_social_media')
        table.string('custom_image_stamp')
    })
};

exports.down = function(knex) {
    return knex.schema.alterTable('Customers', function (table) {
        table.dropColumn('custom_social_media')
        table.dropColumn('custom_image_stamp')
    })
};
