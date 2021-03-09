/*
 * All routes for Maps are defined here
 * Since this file is loaded in server.js into api/maps,
 *   these routes are mounted onto /maps
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const dbParams = require("./../lib/db.js");
const express = require("express");
const { use } = require("bcrypt/promises");
const { user } = require("pg/lib/defaults");
const router = express.Router();

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
        // console.log("USER: ", templateVars.user);
        if (isAjaxReq) {
          res.json(templateVars.maps);
        } else {
          res.render("maps", templateVars);
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
    //   db.query(`SELECT * FROM maps;`)
    //     .then((data) => {
    //       const userID = req.session.user_id;
    //       let templateVars = {
    //         maps: data.rows,
    //         user: userID ? userID : null,
    //       };
    //       if (userID) {
    //         console.log("USER ID: ", getUserByID(userID));
    //         templateVars.user = getUserByID(userID).email;
    //         // db.query(`SELECT * FROM users WHERE id = ${userID};`).then(
    //         //   (resTwo) => {
    //         //     console.log(resTwo.rows[0].email);
    //         //     templateVars = { ...templateVars, user: resTwo.rows[0].email };
    //         //   }
    //         // );
    //       }
    //       const isAjaxReq = req.xhr;
    //       // console.log("USER: ", templateVars.user);
    //       if (isAjaxReq) {
    //         res.json(templateVars.maps);
    //       } else {
    //         res.render("maps", templateVars);
    //       }
    //     })
    //     .catch((err) => {
    //       res.status(500).json({ error: err.message });
    //     });
    // });
    // const getUserByID = function (id) {
    //   return db.query(`SELECT * FROM users WHERE id = ${id};`).then((resTwo) => {
    //     console.log("IN THE FUNC", resTwo.rows[0]);
    //     return resTwo.rows[0];
    //   });
    // };
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
    console.log(data);

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
    const queryParams = [req.params.mapID];

    db.query(`SELECT * FROM maps WHERE id = $1;`, queryParams)
      .then((data) => {
        const templateVars = {
          map: data.rows[0],
          key: dbParams.api,
          latitude: data.rows[0].start_lat,
          longitude: data.rows[0].start_long,
          user: req.session.user_id,
        };

        res.render("map-viewer", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
