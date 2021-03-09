/*
 * All routes for Maps are defined here
 * Since this file is loaded in server.js into api/maps,
 *   these routes are mounted onto /maps
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const dbParams = require('./../lib/db.js');
const { getMapPoints } = require('./../lib/getMapPoints.js');
const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {

    db.query(`SELECT * FROM maps;`)
      .then(data => {
        const templateVars = {
          maps: data.rows
        };
        const isAjaxReq = req.xhr;

        if (isAjaxReq) {
          res.json(templateVars.maps);
        } else {
          res.render("maps", templateVars);
        }
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
    const templateVars = {
      key: dbParams.api
    };

    db.query(`SELECT * FROM maps WHERE id = $1;`, queryParams)
      .then(data => {
        templateVars.map = data.rows[0];
        templateVars.startLat = data.rows[0].start_lat;
        templateVars.startLng = data.rows[0].start_long;
        // templateVars.points = getMapPoints(db, queryParams);
        res.render("map-viewer", templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/:mapID/start_coordinates", (req, res) => {

    const queryParams = [req.params.mapID];
    const mapData = {};
    const mapPoints = getMapPoints(db, queryParams);
    const startCoords = db.query(`SELECT * FROM maps WHERE id = $1;`, queryParams);

    Promise.all([mapPoints, startCoords])
    .then(( [pointsRes, startCoordRes] ) => {
      mapData.points = pointsRes.rows;
      mapData.startLat = startCoordRes.rows[0].start_lat;
      mapData.startLng = startCoordRes.rows[0].start_long;
      res.json(mapData);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
  });

  return router;
};


