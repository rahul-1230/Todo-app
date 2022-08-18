const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../config/auth');

// load helper


// load schema
const Todo = require('../models/Todo');
const User = require('../models/User');
router.get("/fetch", (req, res)=>{
    Todo.find({email:req.query.email}, (error, todoList)=>{
        if(error){
            console.log(error);
        }
        else{
            res.render("Todo.ejs", {todoList: todoList ,email:req.query.email});
        }
    });
});

//route for adding new task
router.post("/newtodo", (req, res)=>{
    var newTask = new Todo({
        name: req.body.task,
        email:req.query.email
    });
    //add to db
    Todo.create(newTask, (err, Todo)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log(`inserted ${newTask} to the database todo`);
            res.redirect("/fetch?email="+req.query.email);
            // res.render("Todo.ejs");
        }
    });
});

//route to delete a task by id
router.get("/delete/:id/:email", (req, res)=>{
    var taskId = req.params.id;//get the id from the api 
    console.log(req.params.id);
    mongoose.model('Todo').deleteOne({email: req.params.email,_id:taskId}, (err, result)=>{
        if(err){
            console.log(`Error is deleting the task ${taskId}`);
        }
        else{
            console.log("Task successfully deleted from database");
            res.redirect("/fetch?email="+req.params.email);
        }
    });
});

//route for deleting all tasks
router.post("/delAlltodo/:id", (req, res)=>{
    var myquery = { name: /^O/ };
    mongoose.model('Todo').deleteMany({email: req.params.id}, (err, result)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log(`Deleted all tasks`);
            res.redirect("/fetch?email="+req.params.id);
        }
    });
});

module.exports = router;