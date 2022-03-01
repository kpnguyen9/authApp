var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const { Users } = require("../models");
const Sequelize = require("sequelize");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  res.render("index");
  // const users = await Users.findAll();
  // res.json(users);
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
    username: newUser.username,
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

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  //takes in username and password values from the "name" properties in the index.ejs file

  const saltRounds = bcrypt.genSaltSync(5);
  const hash = bcrypt.hashSync(password, saltRounds);
  const comparePassword = bcrypt.compareSync(password, hash);
  //compareSync outputs a boolean

  const users = await Users.findOne({
    where: {
      username: username,
      //checking to see if input username matches with a username in DB
    },
  });
  res.json(users);

  console.log(users);

  // res.render("index");
});

module.exports = router;
