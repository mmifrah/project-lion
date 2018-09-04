const express = require("express");
const passport = require("passport");
const authRoutes = express.Router();
const User = require("../models/User");
const util = require("../util/util");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/logout", util.checkAuthentication, (req, res) => {
  req.logout();
  res.redirect("/");
});

authRoutes.get("/login", util.checkLogout, (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

authRoutes.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

authRoutes.get("/signup", util.checkLogout, (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", util.checkLogout, (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email === "" || password === "") {
    res.render("auth/signup", { message: "Indicate email and password" });
    return;
  }

  User.findOne({ email }, "email", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The email already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      email,
      password: hashPass,
      age: req.body.age,
      country: req.body.country,
      city: req.body.city
    });

    newUser.save(err => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        passport.authenticate("local")(req, res, function() {
          res.redirect("/profile");
        });
      }
    });
  });
});

module.exports = authRoutes;
