const express = require("express");
const router = express.Router();
const cookieSession = require("cookie-session");
const app = express();
app.use(
  cookieSession({
    name: "session",
    keys: [
      "7f69fa85-caec-4d9c-acd7-eebdccb368d5",
      "f13b4d38-41c4-46d3-9ef6-8836d03cd8eb",
    ],
  })
);

module.exports = (db) => {
  router.post("/", (req, res) => {
    console.log(req.session.user_id);
    req.session = null;
    res.redirect("/");
  });
  return router;
};
