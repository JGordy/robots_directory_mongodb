const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost:27017/userDirectory");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, lowercase: true, required: true },
  passwordHash: { type: String, required: true },
  name: {type: String, required: true},
  email: String,
  avatar: String,
  university: String,
  job: String,
  company: String,
  skills: [String],
  phone: String,
  address: {
    street_num: Number,
    street_name: String,
    city: String,
    state_or_province: String,
    postal_code: Number,
    country: String
  }
});

userSchema.virtual('password')
    .get(function() {
        return null
    })
    .set(function(value) {
        const hash = bcrypt.hashSync(value, 8);
        this.passwordHash = hash;
    })

userSchema.methods.authenticate = function (password) {
  return bcrypt.compareSync(password, this.passwordHash);
}

userSchema.statics.authenticate = function(username, password, done) {
    this.findOne({
        username: username
    }, function(err, user) {
        if (err) {
            done(err, false)
        } else if (user && user.authenticate(password)) {
            done(null, user)
        } else {
            done(null, false)
        }
    })
};

const User = mongoose.model("Robot", userSchema);

module.exports = User;
