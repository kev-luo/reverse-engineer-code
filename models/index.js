'use strict';

// import node.js core file system module. allows user to interact with file system (eg read, write, edit files)
var fs        = require('fs');
// import node.js core path module. allows user to access file/directory path information
var path      = require('path');
// import sequelize module. this is an ORM that enables communication between a server and a database. Sequelize does this through object syntax by taking a user defined model and interacting with the database using sequelize's defined methods, which contain the SQL syntax
var Sequelize = require('sequelize');
// module.filename returns the absolute path of the file where it's called. path.basename truncates everything but the file name plus the extension 
var basename  = path.basename(module.filename);
// assigns env to 'development' if the NODE_ENV key in process.env is not defined
var env       = process.env.NODE_ENV || 'development';
// import the value corresponding to the env key in the config.json file. importing this provides the login configuration to accessmysql
var config    = require(__dirname + '/../config/config.json')[env];
// instantiate variable and assign to it an empty object
var db        = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
