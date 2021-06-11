const express = require("express");
const User = require("../models/User");
const {
  getUser,
  generateAccessToken,
  authenticateWebToken,
} = require("../util/util");

let app = express.Router();

/* Get all users */
app.get("/", authenticateWebToken, (req, res) => {
  User.find(function (err, doc) {
    if (err) {
      console.error(err);
      return err;
    }
    res.send(doc);
  });
});

/* Get a user */
app.get("/:id", authenticateWebToken, (req, res) => {
  User.findById(req.params.id).exec(function (err, doc) {
    if (err || !doc) {
      console.error(err);
      return err;
    }
    res.send(doc);
  });
});

/* 
Login Route
  1. Check if user exists
  2. Check if password matches
    2.1 If password matches send jwt tokens
*/
app.post("/authenticate", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, function (err, person) {
    if (err || !person)
      return res.send({ message: "Check email exists ", body: person });

    if (person.password !== password) {
      return res.send({ message: "Check password " });
    }

    const { _id, userName, email } = person;

    const token = generateAccessToken({ _id, userName, email });

    res.send({ _id, userName, email, token });
  });
});

/* User update password, change email, role */
app.patch("/:id", authenticateWebToken, (req, res) => {
  const { userName, email, password, confirmPassword, role } = req.body;

  User.findById(req.params.id).exec(function (err, person) {
    if (err) {
      return err;
    }

    if (email) {
      person.email = email;
    }

    if (userName) {
      person.userName = userName;
    }

    if (password && password === confirmPassword) {
      person.password = password;
    }

    if (role) {
      person.role = role;
    }

    person.save(function (err, doc) {
      if (err) {
        return err;
      }

      res.send(doc);
    });
  });
});

/* Create new user */
app.post("/", (req, res) => {
  const newUser = new User(getUser(req.body));

  newUser.save(function (error, document) {
    const { userName, email, _id } = document;

    if (error) console.error(error);
    const token = generateAccessToken({ userName, email, _id });
    document._doc.token = token;
    res.send(document);
  });
});

module.exports = app;
