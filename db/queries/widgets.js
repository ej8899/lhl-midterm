const query = require('../connection');

const getMaps = () => {
  return query('SELECT * FROM maps;', [], result => result.rows);
};

module.exports = {
  getMaps,
  addMaps
};
