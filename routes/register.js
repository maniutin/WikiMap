const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const cookieSession = require("cookie-session");
const app = express();
app.use(
  cookieSession({
    name: "session",
    keys: [
      "7f69fa85-caec-4d9c-acd7-eebdccb368d5",
      "f13b4d38-41c4-46d3-9ef6-8836d03cd8eb",
    ],
  })
);
const { findUserByEmail } = require("../helpers");

module.exports = (db) => {
  router.get("/", (req, res) => {
    const templateVars = {
      user: null,
    };
    res.render("register", templateVars);
  });

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
          ).then((createdUsers) => {
            const user = createdUsers.rows[0];
            console.log(req.session);
            req.session.user_id = user.id;
            const data = {
              error: false,
            };
            res.redirect("/");
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
