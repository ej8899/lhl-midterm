const query = require('../connection');

/**
 * Get a user from the database give email.
 * @param {string} email
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = (email) => {
  return query('SELECT * FROM users WHERE email = $1;', [email], result => result.rows[0]);
};

/**
 * Add a new user to the database.
 * @param {{name: string, email: string, password: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
 const addUser = function(user) {
  const queryValue = [user.name, user.email, user.password];
  return query(`INSERT INTO users (name, email, password) values ($1, $2, $3) RETURNING *;`, queryValue, result => result.rows[0]);
}

module.exports = {
  getUserWithEmail,
  addUser,
};
