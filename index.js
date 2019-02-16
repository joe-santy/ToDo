// ToDo App
// Must be run as sudo

const inquirer = require('inquirer');
const cp = require('child_process');
const mongoose = require('mongoose');


var todoSchema = new mongoose.Schema({
    todo: {type: String}
});

var Todo = mongoose.model('Todo', todoSchema);

function start (){
  inquirer.prompt([{
    type:"list",
    name: "choices",
    message: "Here are your options:",
    choices: [
      "Add ToDo",
      "Delete ToDo"
    ]
  }]).then(function(answer){
    if (answer.choices == "Delete ToDo"){
      mongoose.connect("mongodb://127.0.0.1:27017/todos", { useNewUrlParser: true });
      let db = mongoose.connection;
      let todos = [];
      Todo.find({}).cursor().eachAsync(function(doc){
        todos.push(doc.todo);
      }).then(function(){
        inquirer.prompt([{
          type:"list",
          name: "deletion",
          message: "What do you want to delete?",
          choices: todos
        }]).then(function(answer){
          db.collections.todos.deleteOne({"todo":answer.deletion});
          start();
        });
      });
    }
    if (answer.choices == "Add ToDo"){
      inquirer.prompt([{
        type:"String",
        name: "todo",
        message: "What do you want to do?"
      }]).then(function(answer){
        let todo = answer.todo;
        mongoose.connect("mongodb://127.0.0.1:27017/todos", { useNewUrlParser: true });
        let db = mongoose.connection;
        db.collections.todos.insertOne({"todo": todo});
        start();
      });
    }
  });
}

cp.exec("service mongodb start", start());
