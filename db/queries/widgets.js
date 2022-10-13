const query = require('../connection');

const addFavourite = (favourite) => {
  const queryValues = [
    favourite.map_id,
    favourite.user_id,
  ];

  return query(`INSERT INTO favourites (map_id, user_id) VALUES ($1, $2) RETURNING *;`, queryValues, result => result.rows);
};

const getMapsWithOwnerId = (id) => {
  return query('SELECT * FROM maps WHERE owner_id = $1;', [id], result => result.rows);
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

const getPointsWithMapId = (id) => {
  return query('SELECT * FROM points WHERE map_id = $1;', [id], result => result.rows);
};

const addPoint = (point) => {
  const queryValues = [
    point.title,
    point.map_id,
    point.contributor_id,
    point.description,
    point.image_url,
    point.latitude,
    point.longitude,
  ];

  return query(`
  INSERT INTO points
  (title, map_id, contributor_id, description, image_url, latitude, longitude)
  VALUES ($1, $2, $3, $4, $5, $6, &7)
  RETURNING *;
  `, queryValues, result => result.rows);
};

module.exports = {
  addFavourite,
  getMapsWithOwnerId,
  getPointsWithMapId,
  addMap,
  addPoint,
};
