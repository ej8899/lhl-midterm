const query = require('../connection');

const addFavourite = (favourite) => {
  const queryValues = [
    favourite.map_id,
    favourite.user_id,
  ];

  return query(`INSERT INTO favourites (map_id, user_id) VALUES ($1, $2) RETURNING *;`, queryValues, result => result.rows);
};

const getMaps = () => {
  return query('SELECT * FROM maps;', [], result => result.rows);
};

const addMap = (map) => {
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
  addFavourite,
  getMaps,
  addMap
};
