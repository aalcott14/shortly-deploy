var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');


// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function() {
//     this.on('creating', function(model, attrs, options) {
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });

// module.exports = Link;
var linkSchema = mongoose.Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: Number
}, {timestamps: {}});

linkSchema.methods.setUrl = function() {
  var shasum = crypto.createHash('sha1');
  shasum.update(url);
  this.code = shasum.digest('hex').slice(0, 5);
  return this;
};

linkSchema.statics.insertInDatabase = function(link) {
  link.setUrl(link.url); //TODO Insert in database
  link.save();
};

// linkSchema.query

// animalSchema.query.byName = function(name) {
//   return this.find({ name: new RegExp(name, 'i') });
// };

var Link = mongoose.model('Link', linkSchema);