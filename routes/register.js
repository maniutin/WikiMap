const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const { findUserByEmail } = require("../helpers");

module.exports = (db) => {
  router.get("/", (req, res) => res.render("register"));

  router.post("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then((data) => {
        const users = data.rows;

        const findUser = findUserByEmail(req.body.email, users);
        req.body.canRegister = false;
        if (!findUser) {
          req.body.canRegister = true;
        }
        return req.body;
      })
      .then((bodyObject) => {
        const canRegister = bodyObject.canRegister;
        const emailAddress = bodyObject.email;
        const hashedPass = bcrypt.hashSync(bodyObject.password, 10);
        const thumbnail = bodyObject.img;

        if (canRegister) {
          const queryParams = [
            bodyObject.name,
            emailAddress,
            hashedPass,
            thumbnail,
          ];
          db.query(
            `
            INSERT INTO users (name, email, password, thumbnail_url)
            VALUES ($1, $2, $3, $4) RETURNING *;
            `,
            queryParams
          ).then((res) => {
            const user = res.rows[0];
            req.session.user_id = user.id;
            const data = {
              error: false,
            };
          });
        } else {
          const data = {
            error: true,
          };
          res.send("User exists");
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
