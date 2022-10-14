const query = require('../connection');

const getUsers = () => {
  return query('SELECT * FROM users;', [], result => result.rows);
};

module.exports = { getUsers };
