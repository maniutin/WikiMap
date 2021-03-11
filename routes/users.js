/*
* All routes for Users are defined here
* Since this file is loaded in server.js into api/users,
*   these routes are mounted onto /users
* See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
*/

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/:userId/maps", (req, res) => {
    const currentUser = req.session.user_id;
    if (!currentUser) {
      return res.redirect("/");
    }
    const templateVars = {};

    const queries = [
      `SELECT * FROM users WHERE id = $1;`,
      `SELECT * FROM maps WHERE owner_id = $1;`,
      `SELECT favourites.*, maps.* FROM favourites JOIN maps ON map_id = maps.id WHERE user_id = $1;`,
      `SELECT DISTINCT map_points.user_id AS user_id, maps.id AS map_id, maps.title AS title, maps.description AS description, maps.category AS category, maps.map_image_url AS map_image
      FROM map_points JOIN maps ON map_id = maps.id WHERE user_id = $1;`
    ];

    const queryParams = [currentUser];

    Promise.all([
      db.query(queries[0], queryParams),
      db.query(queries[1], queryParams),
      db.query(queries[2], queryParams),
      db.query(queries[3], queryParams)
    ])
    .then(([
      usersResponse,
      mapsResponse,
      favouritesResponse,
      contributionResponse
    ]) => {
      templateVars.user = usersResponse.rows[0].name;
      templateVars.ownerMaps = mapsResponse.rows;
      templateVars.favouriteMaps = favouritesResponse.rows;
      templateVars.contributionMaps = contributionResponse.rows;
      console.log(templateVars);
      res.render("profile", templateVars);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });

  });

  // Can remove this route, its in the above route
  router.get("/:userId/favourites", (req, res) => {
    const currentUser = req.session.user_id;
    // const currentUser = req.params.userId;
    console.log(currentUser);
    const templateVars = {
      user: currentUser,
    };

    const queryString = `SELECT favourites.*, maps.*, users.name FROM favourites JOIN maps ON map_id = maps.id JOIN users on users.id = user_id WHERE user_id = $1;`;
    const queryParams = [currentUser];

    db.query(queryString, queryParams)
      .then((favouritesResponse) => {
        templateVars.favourites = favouritesResponse.rows;
        templateVars.user = favouritesResponse.rows[0].name;

        console.log(templateVars);
        res.render("favourites", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/:userId/favourites", (req, res) => {
    console.log("got the post req!");
    const currentUser = req.session.user_id ? req.session.user_id : 0;
    if (!currentUser) {
      return res.redirect("/");
    }
    const mapID = req.body.mapID;

    const queryString = `INSERT INTO favourites (user_id, map_id) VALUES ($1, $2);`;
    const queryParams = [currentUser, mapID];
    db.query(queryString, queryParams)
      .then((queryRes) => {
        res.send(queryRes.rows);
      })
      .catch((err) => console.error("query insert error:", err));
    // Stretch: make a query to check if user already added the map to favs
    // db.query(
    //   `SELECT user_id, map_id, COUNT(*)
    //     FROM favourites
    //     GROUP BY user_id, map_id
    //     HAVING COUNT(*)>1`
    // )
    //   .then((res) => console.log("RES: ", res.rows))
    //   .catch((err) => console.error("query insert error:", err));
  });

  router.post("/favourites/delete", (req, res) => {
    const currentUser = req.session.user_id ? req.session.user_id : 0;
    if (!currentUser) {
      return res.redirect("/");
    }
    const mapID = req.body.mapID;

    const queries = [
      `DELETE FROM favourites WHERE user_id = $1 AND map_id = $2 RETURNING favourites;`,
      `SELECT favourites.*, maps.* FROM favourites JOIN maps ON map_id = maps.id WHERE user_id = $1;`
    ];
    const queryParams = [currentUser, mapID];

    db.query(queries[0], queryParams)
    .then(() => {
      db.query(queries[1], [queryParams[0]])
      .then((remainingRes) => {
        res.send(remainingRes.rows);
      })
    })
    .catch((err) => console.error("query insert error:", err));
  });

  // // skeleton code
  // router.get("/api", (req, res) => {
  //   db.query(`SELECT * FROM users;`)
  //     .then(data => {
  //       const users = data.rows;
  //       // res.json({ users });
  //       return users;
  //     })
  // });
  return router;
};
