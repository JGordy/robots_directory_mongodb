const express  = require("express");
const User     = require("../models/user");
const router   = express.Router();
const mongoose = require("mongoose");
const passport = require('passport');

mongoose.connect("mongodb://localhost:27017/userDirectory");
/////// will need to use requireLogin in middleware on my listings???????//////////////
const requireLogin = function (req, res, next) {
  if (req.user) {
    console.log(req.user)
    next()
  } else {
    res.redirect('/signup');
  }
};

const login = function (req, res, next) {
  if (req.user) {
    res.redirect("/")
  } else {
    next();
  }
};
////////////////////////////////////////////////
/////////////authenticate stuffs/////////////////

router.post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/signup',
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
    address: {
    street_num: req.body.streetNum,
    street_name: req.body.streetName,
    city: req.body.city,
    state_or_province: req.body.state,
    postal: req.body.postal,
    country: req.body.country
    }
  }).then(function(data) {
    console.log(data);
    res.render("listings", {users: data, client: currentUser})
    // res.redirect("/");
  })
  .catch(function(err) {
    console.log(err);
    res.redirect("/");
  });
});

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
let data = []; //  variable to store data
let currentUser;

router.get("/", requireLogin, function(req, res) {

  User.find({}).sort("name")
  .then(function(users) {
    currentUser = req.user;
    data = users;
    res.render("listings", {users: data, client: currentUser})
  })
  .catch(function(err) {
    console.log(err);
    next(err);
  });
});

/////////////////////////////////////////////////
/////////////////////////
//
router.get('/looking', function (req, res) {
  // TODO write your code here

  User.find({job: null}).sort("name")
  .then(function(users) {
    data = users;
    res.render("listings", {users: data, client: currentUser})
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
    res.render("listings", {users: data, client: currentUser})
  })
  .catch(function(err) {
    console.log(err);
    next(err);
  })

});

/////////////////////////////////////////////////////////////////////////////
router.get('/listing/:id', function (req, res) {
  if (req.user.id == req.params.id) {

    User.find({_id: req.params.id}).sort("name")
    .then(function(users) {
      // console.log(users);
      data = users;
      res.render("edit_profile", {users: data, client: currentUser})
    })
    .catch(function(err) {
      console.log(err);
      // next(err);
    });

  } else {

    User.find({_id: req.params.id}).sort("name")
    .then(function(users) {
      // console.log(users);
      data = users;
      res.render("singleListing", {users: data, client: currentUser})
    })
    .catch(function(err) {
      console.log(err);
      // next(err);
    });

  }

});


router.post("/save/:id", function(req, res) {
  let tempId = req.params.id
  let profileData = {};

    if (req.body.name) {
      profileData.name = req.body.name;
    };
    if (req.body.email) {
      profileData.email = req.body.email;
    };
    if (req.body.username) {
      profileData.username = req.body.username;
    };
    if (req.body.university) {
      profileData.university = req.body.university;
    };
    if (req.body.company) {
      profileData.company = req.body.company;
    };
    if (req.body.job) {
      profileData.job = req.body.job;
    };
    if (req.body.skills) {
      profileData.skills = req.body.skills;
    };
    if (req.body.phone) {
      profileData.phone = req.body.phone;
    };
    if (req.body.streetNum) {
      profileData.street_num = {"address": req.body.streetNum};
    };
    if (req.body.streetName) {
      profileData.street_name = {"address": req.body.streetName};
    };
    if (req.body.city) {
      profileData.city = {"address": req.body.city};
    };
    if (req.body.state) {
      profileData.state_or_province = {"address": req.body.state};
    };
    if (req.body.postal) {
      profileData.postal_code = {"address": req.body.postal};
    };
    if (req.body.country) {
      profileData.country = {"address": req.body.country};
    };
    if (req.body.director) {
      profileData.director = req.body.director;
    };

    User.update({_id: tempId},
      {$set: profileData})
    .then(function(data) {
      console.log("update: ", data);
      res.redirect("/listing/" + tempId)
    })
    .catch(function(err) {
      console.log("update: ", err);

    })

})

module.exports = router;
