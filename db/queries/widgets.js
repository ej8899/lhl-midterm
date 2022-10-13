const query = require('../connection');

const getMaps = () => {
  return query('SELECT * FROM maps;', [], result => result.rows);
};
const addMap = (map) => {
  console.log(map);
  const queryValues = [
    map.name,
    map.owner_id,
    map.description,
    map.category,
    map.map_pins,
    map.is_private,
  ];

  return query(`
  INSERT INTO maps
  (name, owner_id, description, category, map_pins, is_private)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *;
  `, queryValues, result => result.rows);
};

module.exports = {
  getMaps,
  addMap
};
