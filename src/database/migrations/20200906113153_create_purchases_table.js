
exports.up = function(knex) {
    return knex.schema.createTable('Purchases', (table)=>{
        table.increments('id');
        table.integer('customer_id').unsigned().notNullable();
        table.integer('package_id').unsigned().notNullable();
        table.boolean('is_paid').notNullable().defaultTo(false);
        table.timestamps();

        table.foreign('customer_id').references('Customers.id');
        table.foreign('package_id').references('Packages.id');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Purchases');
};

