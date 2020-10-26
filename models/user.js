// Requiring bcrypt for password hashing. Using the bcryptjs version as the regular bcrypt module sometimes causes errors on Windows machines
var bcrypt = require("bcryptjs");
// Creating our User model
module.exports = function(sequelize, DataTypes) {
  // define a new model (table)
  var User = sequelize.define("User", {
    // creates email field (column) for this model (table)
    email: {
      type: DataTypes.STRING,
      // constraint that means this field cannot be null
      allowNull: false,
      // constraint means any new insertion that is not unique will throw a constraint error
      unique: true,
      // validation checks that this field is formatted like an email (foo@bar.com)
      validate: {
        isEmail: true
      }
    },
    // creates password field (column) for this model (table)
    password: {
      // data type for password is string
      type: DataTypes.STRING,
      // constraint that means this field cannot be null
      allowNull: false
    }
  });
  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  // this is an instance method, which means it's available to use on specific instances of the User model (ie specific users). this.password refers to the password of the user instance, while password is the password input by the user
  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  User.addHook("beforeCreate", function(user) {
    // hashSync is synchronous. the first arg is the actual password, the second arg is the number of salt rounds (ie the number of times the password is hashed). 10 is the default. 
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  });
  return User;
};
