exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('username').notNullable().unique();
    table.string('password').notNullable();
    table.string('role').defaultTo('user'); // Can be 'user' or 'admin'
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
