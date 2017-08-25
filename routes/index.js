const express  = require("express");
const User     = require("../models/user");
const router   = express.Router();
const mongoose = require("mongoose");
const passport = require('passport');

mongoose.connect("mongodb://localhost:27017/userDirectory");

const requireLogin = function (req, res, next) {
  if (req.user) {
    // console.log(req.user)
    next()
  } else {
    res.redirect('/');
  }
};

const login = function (req, res, next) {
  if (req.user) {
    res.redirect("/user")
  } else {
    next();
  }
};

let data = []; //  variable to store data

router.get("/", function(req, res) {

  User.find({}).sort("name")
  .then(function(users) {
    // console.log(users);
    data = users;
    res.render("listings", {users: data})
  })
  .catch(function(err) {
    console.log(err);
    next(err);
  });
});

/////////////////////////////////////////////////
router.get("/", function(req, res) {
// TODO write your code here





});

/////////////////////////
//
router.get('/looking', function (req, res) {
  // TODO write your code here

  User.find({job: null}).sort("name")
  .then(function(users) {
    data = users;
    res.render("listings", {users: data})
  })
  .catch(function(err) {
    console.log(err);
    next(err);
  })

});

//////////////////////////////////////////////////////////////////////////

router.get('/employed', function(req, res) {
  // TODO write your code here


  User.find({job: {$not: {$type: 10}}}).sort("name")
  .then(function(users) {
    data = users;
    res.render("listings", {users: data})
  })
  .catch(function(err) {
    console.log(err);
    next(err);
  })

});

/////////////////////////////////////////////////////////////////////////////
router.get('/listing/:id', function (req, res) {

  User.find({_id: req.params.id}).sort("name")
  .then(function(users) {
    // console.log(users);
    data = users;
    res.render("singleListing", {users: data})
  })
  .catch(function(err) {
    console.log(err);
    next(err);
  });

});

module.exports = router;
