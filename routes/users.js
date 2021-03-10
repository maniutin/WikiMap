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

    const queryString = `SELECT maps.*, users.name FROM maps JOIN users ON owner_id = users.id WHERE owner_id = $1;`;
    const queryParams = [currentUser];

    db.query(queryString, queryParams)
      .then((mapsResponse) => {
        templateVars.ownerMaps = mapsResponse.rows;
        templateVars.user = mapsResponse.rows[0].name;
        console.log("TEMPLATE: ", templateVars.ownerMaps[0].name);

        res.render("profile", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });

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
