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

/**
 * Check if a user exists with a given username and password
 * @param {String} email
 * @param {String} password encrypted
 */
const login = function(email, password) {
  return userQueries.getUserWithEmail(email)
  .then(user => {
    if (bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  });
};

// login
router.post('/login', (req, res) => {
  // const {email, password} = req.body;
  const {email, password} = {email:'at@example.com' ,password: 'password'};
  login(email, password)
    .then(user => {
      if (!user) {
        res.send({error: "error"});
        return;
      }
      req.session.userId = user.id;
      res.send({user: {name: user.name, email: user.email, id: user.id}});
    })
    .catch(err => {
      res
        .status(500)
        .json({ error:err.message});
    });
  });

// create a new user
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
