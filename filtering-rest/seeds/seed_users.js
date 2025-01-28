const bcrypt = require('bcrypt');

exports.seed = async function (knex) {
  const hashedPassword = await bcrypt.hash('password123', 10);
  await knex('users').del();
  return knex('users').insert([
    { username: 'alice', password: hashedPassword, role: 'user' },
    { username: 'bob', password: hashedPassword, role: 'admin' },
  ]);
};
