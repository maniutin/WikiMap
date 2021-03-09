const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");

const { findUserByEmail, checkPassword } = require("../helpers");

module.exports = (db) => {
  router.get("/", (req, res) => res.render("login"));

  router.post("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then((data) => {
        const result = {
          authUser: false,
          authPass: false,
        };
        const users = data.rows;
        const findUser = findUserByEmail(req.body.email, users);
        if (findUser) {
          result.authUser = true;
          const findPass = checkPassword(
            findUser,
            req.body.email,
            req.body.password
          );
          if (findPass) {
            req.session.user_id = findUser.id;
            result.authPass = true;
            res.redirect("/");
          }
        }
        res.json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
