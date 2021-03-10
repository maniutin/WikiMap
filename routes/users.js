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
    // const currentUser = req.params.userId;
    console.log(currentUser);
    const templateVars = {
      user: currentUser,
    };

    const queries = [
      `SELECT * FROM maps WHERE owner_id = $1;`,
      `SELECT DISTINCT map_points.user_id AS user_id, maps.id AS map_id, maps.title AS title, maps.description AS description, maps.category AS category, maps.map_image_url AS map_image
      FROM map_points JOIN maps ON map_id = maps.id WHERE user_id = $1;`
    ]

    const queryString = `SELECT * FROM maps WHERE owner_id = $1;`;
    const queryParams = [currentUser];

    Promise.all([
      db.query(queries[0], queryParams),
      db.query(queries[1], queryParams)
    ])
    .then(([
      mapsResponse,
      contributionResponse
    ]) => {
      templateVars.ownerMaps = mapsResponse.rows;
      templateVars.contributionMaps = contributionResponse.rows;
      console.log(templateVars);
      res.render("profile", templateVars);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });

    // db.query(queryString, queryParams)
    // .then(mapsResponse => {
    //   templateVars.ownerMaps = mapsResponse.rows;
    //     console.log(templateVars);
    //     res.render("profile", templateVars);
    //   })
    // .catch(err => {
    //   res
    //     .status(500)
    //     .json({ error: err.message });
    // });

    // // This is for stretch to include both my maps and favourites on the same page
    // // Run all promises/queries and add them to the templateVars to be rendered
    // Promise.all([
    //   db.query(queries[0], queryParams),
    //   db.query(queries[1], queryParams)
    // ])
    // .then(([
    //   mapsResponse,
    //   favouritesResponse
    // ]) => {
    //   templateVars.ownerMaps = mapsResponse.rows;
    //   templateVars.favourites = favouritesResponse.rows;
    //     console.log(templateVars);
    //     res.render("profile", templateVars);
    //   })
    // .catch(err => {
    //   res
    //     .status(500)
    //     .json({ error: err.message });
    // });
    // .catch(err => console.error("query error:", err));

  });

  router.get("/:userId/favourites", (req, res) => {
    const currentUser = req.session.user_id;
    // const currentUser = req.params.userId;
    console.log(currentUser);
    const templateVars = {
      user: currentUser,
    };

    const queryString = `SELECT favourites.*, maps.* FROM favourites JOIN maps ON map_id = maps.id WHERE user_id = $1;`;
    const queryParams = [currentUser];

    db.query(queryString, queryParams)
    .then(favouritesResponse => {
      templateVars.favourites = favouritesResponse.rows;
        console.log(templateVars);
        res.render("favourites", templateVars);
      })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });

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
