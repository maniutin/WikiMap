const express = require("express");
const router = express.Router();

// const bcrypt = require("bcrypt");

const { findUser, findUserName } = require("../helpers");
// const { response } = require("express");

module.exports = (db) => {
  router.post("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then((data) => {
        const users = data.rows;

        const getUser = findUser(req.body.email, users);
        const getUserName = findUserName(req.body.username, users);
        const password = req.body.password;
        req.body.canRegister = false;

        console.log("CU", getUser, "CUNAME", getUserName);
        if (!getUser && !getUserName) {
          req.body.canRegister = true;
        }

        return req.body;
      })
      .then((bodyObject) => {
        const canRegister = bodyObject.canRegister;
        const emailStr = bodyObject.email;
        const password = req.body.password;
        // const hashedPassword = bcrypt.hashSync(bodyObject.password, 10);

        if (canRegister) {
          const queryParams = [
            bodyObject.username,
            emailStr,
            password,
            bodyObject.thumbnail,
          ];
          db.query(
            `
            INSERT INTO users (username, email, password, thumbnail_url) VALUES ($1, $2, $3, $4) RETURNING *;
            `,
            queryParams
          ).then((response) => {
            const user = response.rows[0];
            console.log(user);
            // req.session.user_id = user.id;
            const data = {
              error: false,
            };
            res.json(data);
          });
        } else {
          const data = {
            error: true,
          };
          res.json(data);
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  }); // router post
  return router;
};
