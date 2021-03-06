var express = require('express');
var router = express.Router();
var multer = require('multer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');//User collection with user.js schema
var Admin = require('../models/admin');//User collection with user.js schema

//LOGIN FUNCTION

exports.login=function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  User.getUserByEmail(email, function(err, user){ //getUserByEmail() function is defined in user.js file
      if(err)
      {console.log(err);
        throw err;}

      if(user==null){
        res.send('Unknown User');
      }
      else if(user)
        {
          User.comparePassword(req.body.password, user.password, function(err, isMatch){//.comparePassword is defined in user.js file
            if(err) return done(err);
            if(isMatch){
              res.send(user);
              console.log('User: You are now logged in');
            //  res.send('You are now logged in');
            } else {
              res.send('Invalid Password');
            }
        });
      }//If user has emailid which is present in database then password is matched.

    });
}


exports.loginAdmin = function(req,res){
  var companyname = req.body.companyname;
  var email = req.body.email;
  var password = req.body.password;
  Admin.getUserByEmail(email, function(err,admin){
    if(err){
      console.log(err);
      throw err;
    }
    if(admin==null){
      console.log('Unknown Admin');
    }
    else if(admin)
    {
      console.log(admin);
      Admin.comparePassword(req.body.password, admin.password, function(err,isMatch){
        if(err) return done(err);
        if(isMatch){
          flag=true;
           res.send(admin);
              console.log('Admin, you are now logged in');
            //  res.send('You are now logged in');
            } else {
              res.send('Invalid Password');
            }
      });
    }
  });
}


//REGISTER FUNCTION

  exports.register=function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var companyname = req.body.companyname;
  var eid = req.body.eid;
  var password = req.body.password;
  var password2 = req.body.password2;


 if (req.file) {
    console.log('Uploading File...');
    var profileimage = req.file.filename;
  } else {
    console.log('No File Uploaded...');
    var profileimage = 'noimage.jpg';
  }

  // Form Validator
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail().withMessage('Email id is not valid');
  req.checkBody('companyname', 'company field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password).withMessage('Passwords do not match');
  var errors = req.validationErrors();//if it has validation errors then missing parameter is shown
  if (errors) {
    res.status(400).send({ "message": "Missing parameter" });
  }
  else {
    User.findOne({email: req.body.email}, function (err, user) {//to check if email is already present in database
      if (err) {
      res.send(err);
      }
      //if a user was found, that means the user's email matches the entered email
      if (user) {
        var err = new Error('A user with that email has already registered. Please use a different email..');
        err.status = 400;
        console.log('invalid email');
        res.send('A user with that email has already registered. Please use a different email..');
        return next(err);
      } else {
        var newUser = new User({
          name: name,
          email: email,
          eid: eid,
          companyname: companyname,
          password: password,
          profileimage: profileimage
        });
        User.createUser(newUser, function (err, user) {//Create user function is defined in user.js, it encrypts the password and stores it in db
          if (err) {
            res.send(err);
          }
          res.send("You are registered");

        });
      }

    });
    }
    }

  //LOGOUT FUNCTION
    exports.logout=function(req, res){
    req.logout();
    res.send('You are now logged out');
    }
