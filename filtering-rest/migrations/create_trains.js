exports.up = function(knex) {
  return knex.schema.createTable('trains', table => {
    table.increments('id').primary();
    table.string('departureStation');
    table.string('arrivalStation');
    table.dateTime('departureTime');
    table.dateTime('arrivalTime');
    table.integer('seatsFirst');
    table.integer('seatsBusiness');
    table.integer('seatsStandard');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('trains');
};
