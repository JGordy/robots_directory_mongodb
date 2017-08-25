const express  = require("express");
const User     = require("../models/user");
const router   = express.Router();
const mongoose = require("mongoose");
const passport = require('passport');

mongoose.connect("mongodb://localhost:27017/userDirectory");
/////// will need to use requireLogin in middleware on my listings???????//////////////
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
////////////////////////////////////////////////
/////////////authenticate stuffs/////////////////

router.get("/", login, function(req, res) {

console.log("NAWT USERRRRRRRRR");
  res.render("signup", {
      messages: res.locals.getMessages()
  });
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/',
    failureFlash: true
}));

router.get("/signup", function(req, res) {
  res.render("signup");
});

router.post("/signup", function(req, res) {

  User.create({
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    email: req.body.email,
    university: req.body.university,
    company: req.body.company,
    job: req.body.job,
    skills: req.body.skills,
    phone: req.body.phone,
    street_num: req.body.streetNum,
    street_name: req.body.streetName,
    city: req.body.city,
    state_or_province: req.body.state,
    postal: req.body.postal,
    country: req.body.country
  }).then(function(data) {
    console.log(data);
    res.render("listings", {users: data})
    // res.redirect("/");
  })
  .catch(function(err) {
    console.log(err);
    res.redirect("/");
  });
});

router.get("/user", requireLogin, function(req, res) {
  console.log("/USERRRRRRRRRR");
  res.render("listings", {username: req.user.username});
});

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
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
