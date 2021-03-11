/*
 * All routes for Maps are defined here
 * Since this file is loaded in server.js into api/maps,
 *   these routes are mounted onto /maps
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const dbParams = require("./../lib/db");
const { use } = require("bcrypt/promises");
const { user } = require("pg/lib/defaults");
const { getMapPoints } = require("./../lib/getMapPoints.js");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const { response } = require("express");

module.exports = (db) => {
  router.get("/", (req, res) => {
    const userID = req.session.user_id ? req.session.user_id : 0;

    Promise.all([
      Promise.resolve(
        db.query(
          `SELECT maps.*, users.name FROM maps JOIN users ON owner_id = users.id`
        )
      ),
      Promise.resolve(db.query(`SELECT * FROM users WHERE id = ${userID};`)),
      Promise.resolve(
        db.query(
          `SELECT maps.id, maps.title, maps.owner_id, users.name FROM maps JOIN users ON owner_id = users.id`
        )
      ),
    ])
      .then((all) => {
        const maps = all[0].rows;
        const user = all[1].rows;
        const mapOwner = all[2].rows;
        console.log("OWNER:", user);
        let templateVars = {
          maps: maps,
          owner: mapOwner[0].name,
          user: userID ? user[0].name : null,
          userID: userID,
        };
        console.log(templateVars.owner);
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
          user: userID ? user[0].name : null,
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
    const queryParams = [req.session.user_id];
    // console.log(data);

    for (const key of Object.keys(data)) {
      queryParams.push(data[key]);
    }

    const queryString = `
    INSERT INTO maps (owner_id, title, category, description, map_image_url)
    VALUES ($1, $2, $3, $4, $5);
    `;

    db.query(queryString, queryParams)
      .then((res) => console.log(res.rows))
      .catch((err) => console.error("query insert error:", err));

    res.redirect("/");
  });

  //delete point on a map
  router.post("/delete/:mapID/points/:title", (req, res) => {
    const mapID = req.params.mapID;
    const pointTitle = req.params.title;
    const queryParams = [pointTitle];
    const queryString = `DELETE FROM map_points WHERE title = $1`;
    db.query(queryString, queryParams)
      .then((response) => res.json({}))
      .catch((err) => console.error("query insert error:", err));
  });

  // Edit Point
  router.post("/edit/:mapID/points/:title", (req, res) => {
    const newAddress = req.body.address;
    const newTitle = req.body.title;
    const newDescription = req.body.description;
    console.log(req.params);
    // const queryParams = [newAddress, newTitle, newDescription];

    axios
      .get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
          address: newAddress,
          key: dbParams.api,
        },
      })
      .then((response) => {
        const coords = response.data.results[0].geometry.location;
        const queryParams = [
          coords.lat,
          coords.lng,
          newTitle,
          newDescription,
          newAddress,
        ];

        const queryString = `UPDATE map_points
        SET latitude = $1,
        longitude = $2,
        title = $3,
        description = $4,
        address = $5
        WHERE map_points.id = ${req.params.title};
        `;
        // Update map marker in db
        db.query(queryString, queryParams)
          .then((edit) => {
            console.log(edit.rows);
          })
          .catch((err) => {
            console.error("query update error:", err);
          });
      })
      .catch((err) => {
        console.log("Geocode error: ", err);
      });
  });

  router.get("/:mapID", (req, res) => {
    const userID = req.session.user_id ? req.session.user_id : 0;
    const queryParams = [req.params.mapID];
    const queryUserID = [userID];

    Promise.all([
      Promise.resolve(
        db.query(`SELECT * FROM maps WHERE id = $1;`, queryParams)
      ),
      Promise.resolve(
        db.query(`SELECT * FROM users WHERE id = $1;`, queryUserID)
      ),
      getMapPoints(db, queryParams),
    ])
      .then((all) => {
        const map = all[0].rows[0];
        const user = all[1].rows;
        const points = all[2].rows;
        console.log(points);
        let templateVars = {
          map: map,
          points: points,
          key: dbParams.api,
          user: userID ? user[0].name : null,
          userID: userID,
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
  router.get("/:mapID/initMap", (req, res) => {
    const queryParams = [req.params.mapID];
    const mapData = {};
    const mapPoints = getMapPoints(db, queryParams);
    const startCoords = db.query(
      `SELECT * FROM maps WHERE id = $1;`,
      queryParams
    );

    Promise.all([mapPoints, startCoords])
      .then(([pointsRes, startCoordRes]) => {
        mapData.points = pointsRes.rows;
        mapData.startLat = startCoordRes.rows[0].start_lat;
        mapData.startLng = startCoordRes.rows[0].start_long;
        res.json(mapData);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // This route is for adding new map points to the database, which then reloads the map-viewer
  router.post("/:mapID/edit", (req, res) => {
    const userID = req.session.user_id ? req.session.user_id : 0;

    if (!userID) {
      return res.redirect("/");
    }

    const data = req.body;
    const address = req.body.address;

    axios
      .get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
          address: address,
          key: dbParams.api,
        },
      })
      .then((response) => {
        const coords = response.data.results[0].geometry.location;
        const queryParams = [
          userID,
          req.params.mapID,
          coords.lat,
          coords.lng,
          data.markerTitle,
          data.markerDesc,
          address,
        ];
        const queryString = `
        INSERT INTO map_points (user_id, map_id, latitude, longitude, title, description, address)
        VALUES ($1, $2, $3, $4, $5, $6, $7);`;
        // Insert new map marker into db
        db.query(queryString, queryParams)
          .then((insert) => {
            console.log(insert.rows);
            res.redirect(`/maps/${req.params.mapID}`);
          })
          .catch((err) => {
            console.error("query insert error:", err);
            res.redirect(`/maps/${req.params.mapID}`);
          });
      })
      .catch((err) => {
        console.log("Geocode error: ", err);
        res.redirect(`/maps/${req.params.mapID}`);
      });
  });

  // Route from initMap ajax request to reverse geocode for address
  router.get("/:mapID/getAddress", (req, res) => {
    const geo = req.query.coords;
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${geo}&key=${dbParams.api}`
      )
      .then((response) => res.send(response.data.results[0].formatted_address))
      .catch((err) => res.send(err));
  });

  return router;
};
