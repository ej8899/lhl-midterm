/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const userQueries = require('../db/queries/users');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
  userQueries.getUsers()
    .then(users => {
      res.json({ users });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.post('/', (req, res) => {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 12);
  userQueries.addUser(user)
  .then(user => {
    if (!user) {
      res.send({error: "error"});
      return;
    }
    req.session.userId = user.id;
  })
  .catch(err => {
    res
      .status(500)
      .json({ error:err.message});
  });
});

module.exports = router;
