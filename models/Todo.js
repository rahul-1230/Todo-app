const mongoose = require('mongoose');

var todoSchema = new mongoose.Schema({
  name: String,
  email:String
});

var Todo = mongoose.model("Todo", todoSchema);
module.exports = Todo
