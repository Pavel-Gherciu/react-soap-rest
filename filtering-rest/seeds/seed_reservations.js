exports.seed = async function(knex) {
  await knex('reservations').del();
  return knex('reservations').insert([
    { userID: 1, trainID: 1, travelClass: 'Standard', tickets: 2, status: 'active' },
    { userID: 2, trainID: 2, travelClass: 'Business', tickets: 1, status: 'active' },
  ]);
};