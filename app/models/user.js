var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');


// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function() {
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function() {
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }
// });

// module.exports = User;


var userSchema = mongoose.Schema({
  username: String,
  password: String,
}, {timestamps: {}});

userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  }); 
};

userSchema.methods.hashPassword = function() {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.password);
  this.password = shasum.digest('hex');
  return this;
};

// userSchema.query.

// animalSchema.query.byName = function(name) {
//   return this.find({ name: new RegExp(name, 'i') });
// };

var User = mongoose.model('User', userSchema);
