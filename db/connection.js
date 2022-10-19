// PG database client/connection setup
const { Pool } = require('pg');

const dbParams = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
};

const pool = new Pool(dbParams);

const query = (text, params, callback) => {
  const start = Date.now();
  return pool.query(text, params)
    .then(result => {
      const duration = Date.now() - start;
      console.log('executed query', { text, duration, params, rows: result.rowCount });
      return callback(result);
    })
    .catch(err => {
      console.log(err.message);
      return err.message;
    });
};

module.exports = query;
