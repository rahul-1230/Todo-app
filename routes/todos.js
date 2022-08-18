const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../config/auth');

// load helper


// load schema
const Todo = require('../models/Todo');
// const Todo = mongoose.model('todos');

// Todo Index Page
router.get('/add', ensureAuthenticated, (req,res) => {
  Todo.find({user: req.user.id}).sort({creationDate:'descending'}).then(todos => {
    res.render('todos/index', {
      todos:todos
    })
  }) // find something in DB
});



// add todo form
router.get('/add', ensureAuthenticated, (req,res) => {

  Todo.find({
    _id: req.query.id
  }).then(todo => {
    if(todo){

    
    // if (todo.user != req.user.id) {
    //   req.flash('error_msg', 'No Todo added');
    //   res.redirect('/users/add');
    // } else {
     res.render('Todo', {
       todo: todo
     });
   }; 
  })
  // res.render('Todo',{email : req.user.email,todo: 'no todo added'}); 
  


});

// edit todo form
router.get('/edit/:id', ensureAuthenticated, (req,res) => {
  Todo.findOne({
    _id: req.params.id
  }).then(todo => {
    if (todo.user != req.user.id) {
      req.flash('error_msg', 'Not authorized');
      res.redirect('/todos');
    } else {
     res.render('todos/edit', {
       todo: todo
     });
   }; 
  })
});

// process  form
router.get('/addTitle', ensureAuthenticated, (req,res) => {
  let errors = [];
  
  if (!req.query.title) {
    errors.push({
      text: 'Please add title'
    })
  }
  // if (!req.body.details) {
  //   errors.push({
  //     text: 'Please add some details'
  //   })
  // }
  console.log(errors)
  console.log(req.body)
  if (errors.length > 0) {
    res.render('Todo', {
      errors: errors,
      title: req.query.title,
      email: req.body.email,
      status: "pending",
      
    });
  } else {
    const newUser = {
      title: req.query.title,
      status: "pending",
      email: req.body.email,
 
    };
    new Todo(newUser).save().then(todo => {
      req.flash('success_msg', 'Todo added');
      res.redirect('/users/add');
      // res.render('Todo', {
      //   errors: errors,
      //   title: req.query.title,
      //   email: req.query.email,
      //   status: "pending",
        
      // });
    })
  }
});

// edit form process
router.put('/:id', ensureAuthenticated, (req,res) => {
  Todo.findOne({
    _id: req.params.id
  }).then(todo => {
    // new values
    todo.title = req.body.title;
    todo.details = req.body.details;
    todo.dueDate = req.body.duedate;
    todo.save().then( todo => {
      req.flash('success_msg', 'Todo updated');
      res.redirect('/todos');
    });
  });
});

// delete Todo
router.delete('/:id', ensureAuthenticated, (req,res) => {
  Todo.remove({
    _id: req.params.id
  }).then(() => {
    req.flash('success_msg', 'Todo removed');
    res.redirect('/todos');
  })
});

index = function ( req, res ){
  Todo.find( function ( err, todos, count ){
    res.render( 'Todo', {
      title : '',
      todo : todo
    });
  });
};

module.exports = router;