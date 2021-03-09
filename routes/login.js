const express = require("express");
const router = express.Router();
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

const bcrypt = require("bcrypt");

const { findUserByEmail, checkPassword } = require("../helpers");

module.exports = (db) => {
  router.get("/", (req, res) => {
    const templateVars = {
      user: null,
    };
    res.render("login", templateVars);
  });

  router.post("/", (req, res) => {
    let templateVars = {};
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
            let userIDArr = [];
            for (let user of users) {
              userIDArr.push(Object.values(user)[0]);
            }
            const foundUserId = userIDArr.find(
              (el) => el === req.session.user_id
            );
            templateVars = {
              user: foundUserId,
            };
            result.authPass = true;
            res.render("register", templateVars);
            return;
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
