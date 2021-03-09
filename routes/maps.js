/*
 * All routes for Maps are defined here
 * Since this file is loaded in server.js into api/maps,
 *   these routes are mounted onto /maps
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const { response } = require('express');
const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {

    db.query(`SELECT * FROM maps;`)
      .then(data => {
        const templateVars = {
          maps: data.rows
        }
        res.render("maps", templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });

    });


  router.get("/users/:userId", (req, res) => {
    // const currentUser = req.session.userId;
    const currentUser = req.params.userId;
    console.log(currentUser);
    const templateVars = {
      currentUser,
    };

    const queryString = `SELECT * FROM maps WHERE owner_id = $1;`;
    const queryParams = [currentUser];

    db.query(queryString, queryParams)
    .then(response => {
      console.log(response.rows);
      templateVars.rows = response.rows;
      console.log(templateVars);
      res.render("profile", templateVars);
    })
    .catch(err => console.error("query error:", err));

  });

  router.get("/new", (req, res) => {
    // Uncomment when we get session login updated
    // req.session.userId would be assigned to a random string on successful post to /register

    // const currentUser = req.session.userId;
    // if (!currentUser) {
    //   return res.redirect("/")
    // }
    // const templateVars = {
    //   user: currentUser,
    // };

    res.render("new");
  });

  router.post("/new", (req, res) => {
    // const currentUser = req.session.userId;
    // if (!currentUser) {
    //   return res.redirect("/")
    // }
    const data = req.body;
    const queryParams = [];
    console.log(data);

    for (const key of Object.keys(data)) {
      queryParams.push(data[key]);
    }

    const queryString = `
    INSERT INTO maps (owner_id, title, category, description, map_image_url)
    VALUES (1, $1, $2, $3, $4);
    `;

    db.query(queryString, queryParams)
      .then(res => console.log(res.rows))
      .catch(err => console.error("query insert error:", err));

    res.redirect("/");
  });

  router.get("/:mapID", (req, res) => {

    const queryParams = [req.params.mapID];

    db.query(`SELECT * FROM maps WHERE id = $1;`, queryParams)
      .then(data => {
        const map = data.rows[0];
        res.json({ map });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });


  return router;
};


