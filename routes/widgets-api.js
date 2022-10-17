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
  const { mapId, contributorId } = req.query;
  widgetsQueries.getPointsWithMapIdAndContributorId({ map_id: mapId, contirbutor_id: contributorId })
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

router.put('/points', (req, res) => {
  const { userId } = req.session;
  const { pointId } = req.query;
  widgetsQueries.updatePoint({ ...req.body, contributor_id: userId, id: pointId })
    .then(point => {
      res.send(point);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.delete('/points', (req, res) => {
  const { pointId } = req.query;
  widgetsQueries.deletePoint(pointId)
    .then(point => {
      res.send(point);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

// favourites
router.get('/favourites', (req, res) => {
  const { userId } = req.session;
  widgetsQueries.getFavouritesWithUserId(userId)
    .then(favourites => {
      res.json({ favourites });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.post('/favourites', (req, res) => {
  const { userId } = req.session;
  const { mapId } = req.body;
  widgetsQueries.addFavourite({ map_id: mapId, user_id: userId })
    .then(favourite => {
      res.send(favourite);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.delete('/favourites', (req, res) => {
  const { userId } = req.session;
  const { mapId } = req.query;
  widgetsQueries.deleteFavourite({ map_id: mapId, user_id: userId })
    .then(favourite => {
      res.send(favourite);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

module.exports = router;
