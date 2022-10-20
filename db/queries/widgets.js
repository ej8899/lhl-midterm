const query = require('../connection');

// maps

/**
 * Get a single map from the database given map_id.
 * @param {String} map_id.
 * @return {Promise<{}>} A promise to the map.
 */
const getMapWithMapId = (id) => {
  return query('SELECT * FROM maps WHERE id = $1;', [id], result => result.rows[0]);
};

/**
 * Get maps from the database given oener_id.
 * @param {String} owner_id.
 * @return {Promise<{}>} A promise to the maps.
 */
const getMapsWithOwnerId = (id) => {
  return query('SELECT * FROM maps WHERE owner_id = $1 ORDER BY name ASC;', [id], result => result.rows);
};

/**
 * Get maps those are not private from the database.
 * @return {Promise<{}>} A promise to the map.
 */
const getAllNoPrivateMaps = () => {
  return query('SELECT * FROM maps WHERE is_private = false ORDER BY name ASC;', [], result => result.rows);
};

/**
 * Add a map to the database.
 * @param {{}}} map. An object containing all of the map details.
 * @return {Promise<{}>} A promise to the map.
 */
const addMap = (map) => {
  const queryValues = [
    map.name,
    map.ownerId,
    map.description,
    map.category,
    map.mapPins,
    map.isPrivate,
  ];

  return query(`
  INSERT INTO maps
  (name, owner_id, description, category, map_pins, is_private)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *;
  `, queryValues, result => result.rows[0]);
};

/**
 * Update a map to the database.
 * @param {{}}} map. An object containing all of the map details.
 * @return {Promise<{}>} A promise to the map.
 */
const updateMap = (map) => {
  const queryValues = [
    map.name,
    map.ownerId,
    map.description,
    map.category,
    map.mapPins,
    map.isPrivate,
    map.mapId,
  ];

  return query(`
  UPDATE maps SET
  (name, owner_id, description, category, map_pins, is_private) =
  ($1, $2, $3, $4, $5, $6)
  WHERE id = $7
  RETURNING *;
  `, queryValues, result => result.rows[0]);
};

/**
 * Delete a map.
 * @param {string}} map id.
 * @return {Promise<{}>} A promise to the point.
 */
const deleteMap = (id) => {
  return query(`DELETE FROM maps WHERE id = $1 RETURNING *;`, [id], result => result.rows[0]);
};

// points

/**
 * Get points from database given map_id.
 * @param {{ mapId: string, contributorId: string }} map_id, contributor_id.
 * @return {Promise<{}>} A promise to the points.
 */
const getPointsWithMapIdAndContributorId = (point) => {
  let whereClause = '';
  let queryValues = [];
  if (!!point.mapId && !!point.contributorId) {
    whereClause += 'WHERE map_id = $1 AND contributor_id = $2';
    queryValues = [point.mapId, point.contributorId];
  }

  if (!!point.mapId && !point.contributorId) {
    whereClause += 'WHERE map_id = $1';
    queryValues = [point.mapId];
  }

  if (!point.mapId && !!point.contributorId) {
    whereClause += 'WHERE contributor_id = $1';
    queryValues = [point.contributorId];
  }

  return query(`SELECT m.name AS map_name, u.name AS contributor_name, p.* FROM points AS p
  JOIN users AS u ON p.contributor_id = u.id
  JOIN maps AS m ON p.map_id = m.id
  ${whereClause}
  ORDER BY map_name ASC, p.title ASC;`, queryValues, result => result.rows);
};

/**
 * Add a point to the database.
 * @param {{}}} point. An object containing all of the point details.
 * @return {Promise<{}>} A promise to the point.
 */
const addPoint = (point) => {
  const queryValues = [
    point.title,
    point.mapId,
    point.contributorId,
    point.description,
    point.imageUrl,
    point.latitude,
    point.longitude,
  ];

  return query(`
  INSERT INTO points
  (title, map_id, contributor_id, description, image_url, latitude, longitude)
  VALUES ($1, $2, $3, $4, $5, CAST($6 AS DECIMAL), CAST($7 AS DECIMAL))
  RETURNING *;
  `, queryValues, result => result.rows[0]);
};

/**
 * Update a point to the database.
 * @param {{}}} point. An object containing all of the point details.
 * @return {Promise<{}>} A promise to the point.
 */
const updatePoint = (point) => {
  const queryValues = [
    point.title,
    point.mapId,
    point.contributorId,
    point.description,
    point.imageUrl,
    point.latitude,
    point.longitude,
    point.pointId,
  ];

  return query(`
  UPDATE points SET
  (title, map_id, contributor_id, description, image_url, latitude, longitude) =
  ($1, $2, $3, $4, $5, CAST($6 AS DECIMAL), CAST($7 AS DECIMAL))
  WHERE id = $8
  RETURNING *;
  `, queryValues, result => result.rows[0]);
};

/**
 * Delete a point.
 * @param {string}} point id.
 * @return {Promise<{}>} A promise to the point.
 */
const deletePoint = (id) => {
  return query(`DELETE FROM points WHERE id = $1 RETURNING *;`, [id], result => result.rows[0]);
};

// favourites

/**
 * Get favourite maps from database given user_id.
 * @param {string}} user_id.
 * @return {Promise<{}>} A promise to the point.
 */
const getFavouritesWithUserId = (id) => {
  return query(`SELECT f.*, u1.name AS user_name, m.name AS map_name, m.owner_id, u2.name AS owenr_name, m.description, m.category, m.map_pins, m.is_private
  FROM favourites AS f
  JOIN users AS u1 ON f.user_id = u1.id
  JOIN maps AS m ON f.map_id = m.id
  JOIN users AS u2 ON m.owner_id = u2.id
  WHERE user_id = $1;`, [id], result => result.rows);
};

/**
 * Add a favourite to the database.
 * @param {{}}} user_id, map_id.
 * @return {Promise<{}>} A promise to the favourite.
 */
const addFavourite = (favourite) => {
  const queryValues = [
    favourite.mapId,
    favourite.userId,
  ];

  return query(`INSERT INTO favourites (map_id, user_id) VALUES ($1, $2) RETURNING *;`, queryValues, result => result.rows[0]);
};

/**
 * Delete a favourite.
 * @param {{}}} user_id, map_id.
 * @return {Promise<{}>} A promise to the favourite.
 */
const deleteFavourite = (favourite) => {
  const queryValues = [
    favourite.mapId,
    favourite.userId,
  ];

  return query(`DELETE FROM favourites WHERE map_id = $1 AND user_id = $2 RETURNING *;`, queryValues, result => result.rows[0]);
};

module.exports = {
  getMapWithMapId,
  getMapsWithOwnerId,
  getAllNoPrivateMaps,
  getPointsWithMapIdAndContributorId,
  addMap,
  updateMap,
  deleteMap,
  addPoint,
  updatePoint,
  deletePoint,
  getFavouritesWithUserId,
  addFavourite,
  deleteFavourite,
};
