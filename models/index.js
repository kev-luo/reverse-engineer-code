'use strict';

// import node.js core file system module. allows user to interact with file system (eg read, write, edit files)
var fs        = require('fs');
// import node.js core path module. allows user to access file/directory path information
var path      = require('path');
// import sequelize module. this is an ORM that enables communication between a server and a database. Sequelize does this through object syntax by taking a user defined model and interacting with the database using sequelize's defined methods, which contain the SQL syntax
var Sequelize = require('sequelize');
// module.filename returns the absolute path of the file where it's called. path.basename truncates everything but the file name plus the extension. in this case basename=index.js
var basename  = path.basename(module.filename);
// assigns env to 'development' if the NODE_ENV key in process.env is not defined
var env       = process.env.NODE_ENV || 'development';
// import the value corresponding to the env key in the config.json file. importing this provides the login configuration to accessmysql
var config    = require(__dirname + '/../config/config.json')[env];
// instantiate variable and assign to it an empty object
var db        = {};

// checks if use_env_variable is a key in the config object
if (config.use_env_variable) {
  // if it is then we create a sequelize instance using the defined environment variable
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  // if it isn't then we create a sequelize instance using the config values
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  // readdirSync returns array containing files in the specified directory, in this case the current directory (__dirname)
  .readdirSync(__dirname)
  // filter uses callback function on each array item. items that return true from the callback function will get passed into a new array which is what the filter method returns 
  .filter(function(file) {
    // callback function returns true if the file doesn't begin with '.', AND the filename doesn't equal 'index.js' AND the file is a javascript file
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  // forEach alters the array passed to it by passing each array item to a callback function
  .forEach(function(file) {
    // TODO:
    var model = sequelize['import'](path.join(__dirname, file));
    // adds new key/value pair to db object. the value is the class constructor model, and the key is the contructor's name
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;
