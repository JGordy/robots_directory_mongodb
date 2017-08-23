const express = require("express");
const router  = express.Router();

let data = [];

const getListings = function(req, res, next) {
  let MongoClient = require("mongodb").MongoClient;
  let assert      = require("assert");
  let url = "mongodb://localhost:27017/userDirectory"; // represents our mongo database

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);

    getData(db, function() {
      db.close();
      next();
    });
  });

  let getData = function(db, callback) {
    let users = db.collection("users");

    users.find({}).toArray().then(function(users) {
      data = users;
      callback();
    });
  }

};

router.get("/", getListings, function(req, res) {
  // TODO write your code here
  console.log(data);
  res.render("listings", {users: data});
})
//////////////////////////////////////////////////////////////////////////

getLooking = function(req, res, next) {
  let MongoClient = require("mongodb").MongoClient;
  let assert      = require("assert");
  let url = "mongodb://localhost:27017/userDirectory"; // represents our mongo database

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);

    getData(db, function() {
      db.close();
      next();
    });
  });

  let getData = function(db, callback) {
    let users = db.collection("users");

    users.find({"job": null}).toArray().then(function(users) {
      data = users;
      callback();
    });
  }

};

router.get('/looking', getLooking, function (req, res) {
  // TODO write your code here
  res.render("looking", {users: data});
});


//////////////////////////////////////////////////////////////////////////
getEmployed = function(req, res, next) {
  let MongoClient = require("mongodb").MongoClient;
  let assert      = require("assert");
  let url = "mongodb://localhost:27017/userDirectory"; // represents our mongo database

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);

    getData(db, function() {
      db.close();
      next();
    });
  });

  let getData = function(db, callback) {
    let users = db.collection("users");

    users.find({"job": {$nin: [null]}}).toArray().then(function(users) {
      data = users;
      callback();
    });
  }

};

router.get('/employed', getEmployed, function(req, res) {
  //
  res.render("employed", {users: data})
});

/////////////////////////////////////////////////////////////////////////////
router.get('/listing/:id', function (req, res) {

  res.render("singleListing", {users: data[req.params.id -1]});
})

module.exports = router;
