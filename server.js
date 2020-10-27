// Requiring necessary npm packages
var express = require("express");
var session = require("express-session");
// Requiring passport as we've configured it
var passport = require("./config/passport");

// Setting up port and requiring models for syncing
var PORT = process.env.PORT || 8080;
var db = require("./models");

// Creating express app and configuring middleware needed for authentication
var app = express();
// allows server to recognize post/put request objects as strings/arrays
app.use(express.urlencoded({ extended: true }));
// allows server to recognize post/put request objects as JSON
app.use(express.json());
// allows files in 'public' directory to be accessed by the root url
app.use(express.static("public"));
// We need to use sessions to keep track of our user's login status
// initializes session middleware
// only the session id is saved in the cookie. session data is saved server side
app.use(session({ 
  secret: "keyboard cat", // needed to sign session ID cookie
  resave: true, // saves session back to session store even if no modifications were made
  saveUninitialized: true // saves new and unmodified session to store
}));
app.use(passport.initialize()); // initialize passport
app.use(passport.session()); // sets req.user to deserialized user object

// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

// Syncing our database and logging a message to the user upon success
db.sequelize.sync({ force: true }).then(function() {
  app.listen(PORT, function() {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
});
