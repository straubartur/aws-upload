
exports.up = function(knex) {
    return knex.schema.table('Customers', (table)=>{
        table.text('aws_logo_path');
    });
};

exports.down = function(knex) {
    return knex.schema.table('Customers', (table)=>{
        table.dropColumn('aws_logo_path');
    });
};
