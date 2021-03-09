const express = require("express");
const router = express.Router();

// const bcrypt = require("bcrypt");

const { findUser } = require("../helpers");

module.exports = (db) => {
  router.get("/", (req, res) => res.render("login"));

  router.post("/", (req, res) => {
    console.log(req.body);
  }); // router post
  return router;
};
