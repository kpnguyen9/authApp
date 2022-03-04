var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const { Users } = require("../models");
const Sequelize = require("sequelize");
const saltRounds = process.env.SALT_ROUNDS;
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

console.log("user.js salt rounds are:", saltRounds);

/* GET users listing. */
router.get("/login", async function (req, res, next) {
  res.render("login");
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

  const hash = bcrypt.hashSync(password, saltRounds);

  console.log("my password:", password);
  console.log("my hashed password:", hash);

  // bcrypt.hash(myPassword, saltRounds, (err, hash) => {});

  res.send("new user added");
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  //takes in username and password values from the "name" properties in the index.ejs file

  // const saltRounds = bcrypt.genSaltSync(5);
  // const hash = bcrypt.hashSync(password, saltRounds);

  //compareSync outputs a boolean

  const users = await Users.findOne({
    where: {
      username: username,
      //checking to see if input username matches with a username in DB
    },
  });
  // res.json(users);

  const dbPassword = users.password;
  //extracted password from specific user in database
  console.log("this is dbPassword", dbPassword);
  console.log("this is password", password);

  const comparePassword = bcrypt.compareSync(password, dbPassword);
  console.log("comparePassword result:", comparePassword);
  //compares entered password by the user to the extracted password from the database

  if (comparePassword) {
    const token = jwt.sign(
      {
        data: username,
      },
      secretKey,
      { expiresIn: "1h" }
    );
    console.log("token is:", token);
    res.cookie("token", token);
    console.log("authorized");
    res.redirect("/users/protected");
  } else {
    res.send("not authorized");
    console.log("no user found");
  }
});

//middleware for protected route
const isValidUser = (req, res, next) => {
  // user logs in
  //when user logs in, create JWT, save as cookeie
  //when user accesses a protected route
  //use middleware to validate JWT
  //if valid, render router or next()
  //else throw error, redirect to login

  const authToken = req.cookies["token"];

  jwt.verify(authToken, secretKey, function (err, decoded) {
    console.log("Decoded", decoded); // bar
    if (decoded.data) {
      next();
    } else {
      res.send(err);
    }
  });
};

//get request for protected route
router.get("/protected", isValidUser, (req, res, next) => {
  res.send("Authorized user, protected route");
});
module.exports = router;
