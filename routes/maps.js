/*
 * All routes for Maps are defined here
 * Since this file is loaded in server.js into api/maps,
 *   these routes are mounted onto /maps
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {
    db.query(`SELECT * FROM maps;`)
      .then(data => {
        const maps = data.rows;
        res.json({ maps });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    });

  router.get("/", (req, res) => {
    // Uncomment when we get session login updated
    // const currentUser = req.session.userId;
    // if (!currentUser) {
    //   return res.redirect("/")
    // }
    console.log("Response is: ", res);
    res.render("new");
  });
  router.post("new", (req, res) => {
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


