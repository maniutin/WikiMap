/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

// const express = require('express');
// const router  = express.Router();

// module.exports = (db) => {
//   router.get("/", (req, res) => {
//     // const currentUser = req.session.userId;

//     // if (!currentUser) {
//     //   return res.redirect("/")
//     // }
//     console.log("Response is: ", res);
//     // res.send("get");
//     res.render("new");
//   });
//   router.post("new", (req, res) => {
//     const data = req.body;
//     const values = [];
//     db.query(`
//     INSERT INTO maps (title, description, category, map_image_url)
//     VALUES ($1, $2, $3, $4);
//     `, values)
//       .then(data => {
//         const users = data.rows;
//         res.json({ users });
//       })
//       .catch(err => {
//         res
//           .status(500)
//           .json({ error: err.message });
//       });
//   });
//   return router;
// };
