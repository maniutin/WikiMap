/*
 * All routes for Maps are defined here
 * Since this file is loaded in server.js into api/maps,
 *   these routes are mounted onto /maps
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const dbParams = require('./../lib/db.js');
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

  router.get("/new", (req, res) => {
    // Uncomment when we get session login updated
    // req.session.userId would be assigned to a random string on successful post to /register

    // const currentUser = req.session.userId;
    // if (!currentUser) {
    //   return res.redirect("/")
    // }

    res.render("new");
  });

  router.post("/new", (req, res) => {
    const data = req.body;
    const values = [];
    db.query(`
    INSERT INTO maps (title, description, category, map_image_url)
    VALUES ($1, $2, $3, $4);
    `, values)
  });

  router.get("/:mapID", (req, res) => {

    const queryParams = [req.params.mapID];

    db.query(`SELECT * FROM maps WHERE id = $1;`, queryParams)
      .then(data => {
        const templateVars = {
          map: data.rows[0],
          key: dbParams.api
        }
        res.render("map-viewer", templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });


  return router;
};


