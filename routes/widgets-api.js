/*
 * All routes for Widget Data are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /api/widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const widgetsQueries  = require('../db/queries/widgets');

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

router.get('/maps', (req, res) => {
  widgetsQueries.getMaps()
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
  const userId = req.session.userId;
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


module.exports = router;
