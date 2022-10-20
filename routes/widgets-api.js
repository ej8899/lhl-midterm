/*
 * All routes for Widget Data are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /api/widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

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
  widgetsQueries.addMap({ ...req.body, ownerId: userId })
    .then(map => {
      res.send(map);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.put('/maps', (req, res) => {
  const { userId } = req.session;
  const { mapId } = req.body;
  widgetsQueries.getMapWithMapId(mapId)
    .then(map => {
      return !map.is_private || Number(userId) === map.owner_id;
    })
    .then(value => {
      if (!value) {
        res.status(400)
          .json({ error: 'Invalid values'});
        return;
      }

      return  widgetsQueries.updateMap(req.body)
        .then(map => {
          res.send(map);
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });
        });
    })
    .then(map => {
      res.send(map);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.delete('/maps', (req, res) => {
  const { userId } = req.session;
  const { mapId } = req.query;

  widgetsQueries.getMapsWithOwnerId(userId)
    .then(maps => {
      // return boolean whether the user own the given mapId
      return maps.map(m => m.id).includes(Number(mapId));
    })
    .then(value => {
      // if the returned value is false, the user don't own the map and response an error
      if (!value) {
        res.status(400)
          .json({ error: 'Invalid values'});
        return;
      }

      return widgetsQueries.deleteMap(mapId)
        .then(map => {
          res.send(map);
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });
        });
    })
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
  widgetsQueries.getPointsWithMapIdAndContributorId({ mapId, contributorId })
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
  widgetsQueries.addPoint({ ...req.body, contributorId: userId })
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
  widgetsQueries.updatePoint({ ...req.body, contributorId: userId })
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
  const { mapId } = req.query;
  widgetsQueries.addFavourite({ mapId, userId })
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
  widgetsQueries.deleteFavourite({ mapId, userId })
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
