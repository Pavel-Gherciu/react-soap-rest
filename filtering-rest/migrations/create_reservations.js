exports.up = function(knex) {
  return knex.schema.createTable('reservations', table => {
    table.increments('id').primary();
    table.integer('userID').unsigned().notNullable();
    table.integer('trainID').unsigned().notNullable();
    table.string('travelClass').notNullable();
    table.integer('tickets').notNullable();
    table.string('status').defaultTo('active'); // 'active' or 'cancelled'
    table.foreign('userID').references('id').inTable('users');
    table.foreign('trainID').references('id').inTable('trains');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('reservations');
};