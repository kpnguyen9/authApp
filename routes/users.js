var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const { Users } = require("../models");
const Sequelize = require("sequelize");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  // res.send("respond with a resource");
  const users = await Users.findAll();
  res.json(users);
});

router.post("/register", async (req, res, next) => {
  let { username, password, email } = req.body;
  const saltRounds = bcrypt.genSaltSync(5);
  password = bcrypt.hashSync(password, saltRounds);
  const newUser = await Users.create({
    username,
    password,
    email,
  });

  res.json({
    newUser,
  });
  console.log("added new user:", username, password, email);
});

router.post("/", (req, res, next) => {
  const password = "hello";

  const saltRounds = bcrypt.genSaltSync(5);
  const hash = bcrypt.hashSync(password, saltRounds);

  console.log("my password:", password);
  console.log("my hashed password:", hash);

  // bcrypt.hash(myPassword, saltRounds, (err, hash) => {});

  res.send("new user added");
});

router.post("/login", (req, res, next) => {
  const password = "hello";
  const wrongPassword = "goodbye";

  const saltRounds = bcrypt.genSaltSync(5);
  const hash = bcrypt.hashSync(password, saltRounds);
  const comparePassword = bcrypt.compareSync(password, hash);
  const wrongComparePassword = bcrypt.compareSync(wrongPassword, hash);
  //compareSync outputs a boolean

  console.log("my password:", password);
  console.log("my hashed password:", hash);
  console.log("is correct password correct?:", comparePassword);
  console.log("is wrong password correct?:", wrongComparePassword);

  res.send("password checked");
});

module.exports = router;
