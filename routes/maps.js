/*
 * All routes for Maps are defined here
 * Since this file is loaded in server.js into api/maps,
 *   these routes are mounted onto /maps
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const dbParams = require("./../lib/db");
const { use } = require("bcrypt/promises");
const { user } = require("pg/lib/defaults");
const { getMapPoints } = require('./../lib/getMapPoints');
const { getCoords } = require('../lib/getCoords');
const axios = require('axios');
const express = require('express');
const { response } = require("express");
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const userID = req.session.user_id ? req.session.user_id : 0;

    Promise.all([
      Promise.resolve(db.query(`SELECT * FROM maps;`)),
      Promise.resolve(db.query(`SELECT * FROM users WHERE id = ${userID};`)),
    ])
      .then((all) => {
        const maps = all[0].rows;
        const user = all[1].rows;
        let templateVars = {
          maps: maps,
          user: userID ? user[0].email : null,
        };
        const isAjaxReq = req.xhr;
        if (isAjaxReq) {
          res.json(templateVars.maps);
        } else {
          res.render("maps", templateVars);
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });

  });
  router.get("/new", (req, res) => {
    // Uncomment when we get session login updated
    // req.session.userId would be assigned to a random string on successful post to /register
    const userID = req.session.user_id ? req.session.user_id : 0;

    Promise.all([
      Promise.resolve(db.query(`SELECT * FROM maps;`)),
      Promise.resolve(db.query(`SELECT * FROM users WHERE id = ${userID};`)),
    ])
      .then((all) => {
        const maps = all[0].rows;
        const user = all[1].rows;
        let templateVars = {
          maps: maps,
          user: userID ? user[0].email : null,
        };
        const isAjaxReq = req.xhr;
        if (isAjaxReq) {
          res.json(templateVars.maps);
        } else {
          res.render("new", templateVars);
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
    const currentUser = req.session.user_id;
    if (!currentUser) {
      return res.redirect("/");
    }
    // const templateVars = {
    //   user: currentUser,
    // };

    // res.render("new", templateVars);
  });

  router.post("/new", (req, res) => {
    // const currentUser = req.session.userId;
    // if (!currentUser) {
    //   return res.redirect("/")
    // }
    const data = req.body;
    const queryParams = [];
    // console.log(data);

    for (const key of Object.keys(data)) {
      queryParams.push(data[key]);
    }

    const queryString = `
    INSERT INTO maps (owner_id, title, category, description, map_image_url)
    VALUES (1, $1, $2, $3, $4);
    `;

    db.query(queryString, queryParams)
      .then((res) => console.log(res.rows))
      .catch((err) => console.error("query insert error:", err));

    res.redirect("/");
  });

  router.get("/:mapID", (req, res) => {

    const userID = req.session.user_id ? req.session.user_id : 0;
    const queryParams = [req.params.mapID];
    const queryUserID = [userID];

    Promise.all([
      Promise.resolve(db.query(`SELECT * FROM maps WHERE id = $1;`, queryParams)),
      Promise.resolve(db.query(`SELECT * FROM users WHERE id = $1;`, queryUserID)),
      getMapPoints(db, queryParams)
    ])
      .then((all) => {
        const map = all[0].rows[0];
        const user = all[1].rows;
        const points = all[2].rows;
        let templateVars = {
          map: map,
          points: points,
          key: dbParams.api,
          user: userID ? user[0].email : null,
        };
        const isAjaxReq = req.xhr;
        if (isAjaxReq) {
          res.json(templateVars.maps);
        } else {
          res.render("map-viewer", templateVars);
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // This route is for the ajax call from initMap.js when the Google Maps API is requested
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

    // This route is for the ajax call from initMap.js when the Google Maps API is requested
    router.post("/:mapID/edit", (req, res) => {

      const userID = req.session.user_id ? req.session.user_id : 0;

      if (!userID) {
        return res.redirect("/");
      }
      //?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=${dbParams.api}`;
      const data = req.body;
      const address = req.body.address;

      axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
          address: address,
          key: dbParams.api
        }
      })
        .then(response => {
          const coords = response.data.results[0].geometry.location;
          const queryParams = [userID, req.params.mapID, coords.lat, coords.lng, data.markerTitle, data.markerDesc];
          const queryString = `
          INSERT INTO map_points (user_id, map_id, latitude, longitude, title, description)
          VALUES ($1, $2, $3, $4, $5, $6);`;
          // Insert new map marker into db
          db.query(queryString, queryParams)
            .then((insert) => {
              console.log(insert.rows);
              res.redirect(`/maps/${req.params.mapID}`);
            })
            .catch((err) => console.error("query insert error:", err));
        })
        .catch(err => {
          console.log('Geocode error: ', err);
        });



    });

  return router;
};
