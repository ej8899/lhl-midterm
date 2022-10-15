/*
 * All routes for Widget Data are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /api/widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */
/* eslint-disable camelcase*/

const express = require('express');
const router  = express.Router();
const widgetsQueries  = require('../db/queries/widgets');

// favourites
router.post('/favourites', (req, res) => {
  const userId = req.session.userId;
  const { map_id } = req.body;
  widgetsQueries.addFavourite({ map_id, user_id: userId })
    .then(favourite => {
      res.send(favourite);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

// maps
router.get('/maps', (req, res) => {
  const { userId } = req.session;
  widgetsQueries.getMapsWithOwnerId(userId)
    .then(maps => {
      res.json({ maps });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.get('/no-private-maps', (req, res) => {
  widgetsQueries.getAllNoPrivateMaps()
    .then(maps => {
      res.json({ maps });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.post('/maps', (req, res) => {
  const { userId } = req.session;
  widgetsQueries.addMap({ ...req.body, owner_id: userId })
    .then(map => {
      res.send(map);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

// points
router.get('/points', (req, res) => {
  const { mapId } = req.query;
  widgetsQueries.getPointsWithMapId(mapId)
    .then(points => {
      res.json({ points });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.post('/points', (req, res) => {
  const { userId } = req.session;
  widgetsQueries.addPoint({ ...req.body, contributor_id: userId })
    .then(point => {
      res.send(point);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

module.exports = router;
