const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const url = require('url');
// const multer = require('multer')
// const app = express();
// Load User model

const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');
const { dir } = require('console');
// router.use(express.static(path.join(__dirname,'public')));

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./routes/uploads/")
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now())
//   }
// })
// var upload = multer({ storage: storage })
// Step 5 - set up multer for storing uploaded files



// var storage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		cb(null, 'uploads')
// 	},
// 	filename: (req, file, cb) => {
// 		cb(null, file.fieldname + '-' + Date.now())
// 	}
// });

// var upload = multer({ storage: storage });

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  console.log(req.body)
  // console.log(req.file)
  const { name, username, email, password, password2 } = req.body;
  // console.log(profilepic)
  let errors = [];
   
  if (!name || !username || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      username,
      email,
      password,
      
  })

  } else {
    User.findOne({ email: email } || { username: username }).then(user => {
      if (user) {
        errors.push({ msg: 'User is already exists' });
        res.render('register', {
          errors,
          name,
          username,
          email,
          password,
          // profilepic
        });
      } else {
        const newUser = new User({
          name,
          username,
          email,
          password
        //   profilepic1: {
        //     data: fs.readFileSync(path.join(__dirname+'/uploads/' + req.file.filename)),
        //     contentType: 'image/png'
        
        // },
          // profilepic : req.file.path
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {


  passport.authenticate('local', {
  
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);


  // Logout
  router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });
});

router.get('/edit',(req, res) => {
 
  res.render('editprofile',{ user: req.user })
});

router.post('/update',function(req, res, next){
  
  User.update({ _id: req.user.id}, req.body, function(err, user){
    console.log(req.body)
      if(!user){
          req.flash('error', 'No account found');
          return res.redirect('/edit');
      }
      var name = req.body.name;
      var username = req.body.username;
      var email = req.body.email;
      var password = req.body.password;
      if( username.length <= 0 || name.length <= 0 || password.length <= 0){
          req.flash('error', 'One or more fields are empty');
          res.redirect('/dashboard');
      }
      
   
  

      else{
          user.name = name;
          user.username = username;
          user.email = email;
          user.password = password;
          // bcrypt.genSalt(10, (err, salt) => {
          //   bcrypt.hash(password, salt, (err, hash) => {
          //     if (err) throw err;
          //     password = hash;
          //     User
          //       .save()
          //       .then(user => {
          //         req.flash(
          //           'success_msg',
          //           'detail update succesfully'
          //         );
          //         res.redirect('/dashboard');
          //       })
          //       .catch(err => console.log(err));
          //   });
          // });
          req.flash('success_msg', 'Updated data Sucessfully');
          res.redirect('/dashboard');
      }
    })
  });

module.exports = router;
