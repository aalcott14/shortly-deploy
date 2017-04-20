var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
var Users = require('../app/collections/users');
var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find({}, function(err, links) {
    res.status(200).send(links.models);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }
  //change this to mongo
  Link.find({url: uri}, function(err, links) {
    if (err) {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }
        var newLink = new Link({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        });
        newLink.setUrl().save(function(err, link) {
          if (err) {
            console.log('error inserting ', link, 'to the database ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
          }
          res.status(200).send(link);
        });
      });
    } else {
      console.log('links-------------------------------', links);
      res.status(200).send(links[0]);
    }
  });

  // new Link({ url: uri }).fetch().then(function(found) {
  //   if (found) {
  //     res.status(200).send(found.attributes);
  //   } else {
  //     util.getUrlTitle(uri, function(err, title) {
  //       if (err) {
  //         console.log('Error reading URL heading: ', err);
  //         return res.sendStatus(404);
  //       }
  //       var newLink = new Link({
  //         url: uri,
  //         title: title,
  //         baseUrl: req.headers.origin
  //       });
  //       newLink.save().then(function(newLink) {
  //         Links.add(newLink);
  //         res.status(200).send(newLink);
  //       });
  //     });
  //   }
  // });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.find({ username: username }, function(err, user) {
    if (err) {
      res.redirect('/login');
    } else {
      user.comparePassword(password, function(match) {
        if (match) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      });
    }
  });
    // .then(function(user) {
    //   if (!user) {
    //     res.redirect('/login');
    //   } else {
    //     user.comparePassword(password, function(match) {
    //       if (match) {
    //         util.createSession(req, res, user);
    //       } else {
    //         res.redirect('/login');
    //       }
    //     });
    //   }
    // });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.find({ username: username }, function(err, user) {
    if (err) {
      var newUser = new User({
        username: username,
        password: password
      });
      newUser.hashPassword().save()
        .then(function(newUser) {
          util.createSession(req, res, newUser);
        });
    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    }
  });
};

exports.navToLink = function(req, res) {
  Link.find({ code: req.params[0] }, function(err, links) {
    if (err) {
      res.redirect('/');
    } else {
      Link.findByIdAndUpdate(links[0].id, { $set: { visits: links[0].visits + 1 }}, function (err, link) {
        if (err) {
          console.log('CANNOT DO SOMETHING ==========', err);
          return;
        } 
        res.redirect(link.url);
      });
    }
  });
};