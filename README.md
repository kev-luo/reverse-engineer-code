
# reverse-engineer-code

## High-Level Overview
This is a simple login application that implements Passport js to authenticate user logins, and uses Sequelize to interact with our database. While the actual users are stored in a MySQL database, the session data is stored in a memory store instance (Express js default) which resets on every app relaunch. Additionally, by using Bcrypt js, we stored the hashed and salted user passwords in the database. The purpose of this readme is to reverse-engineer the application code and provide an explanation for how it works.

## The Nuts and Bolts
To run the app, use can type in nodemon server.js which initializes our express app and configures the necessary middleware for it to run (eg passport, session, express.json etc.). At the very end of this file we connect to our MySQL database, and only after successfully connecting to it do we begin listening for requests to our express app server. The index.js file in the models folder is how we are able to connect to our database. Index.js checks the configuration paramaters from config.json, then creates tables (if they don't already exist) in our database based on the other models saved in the models folder. 

The model files specify the column names, data types, constraints, and validations, as well as lays out relationships with other tables.  In this case we only had User.js. In User.js, we added an instance method called validPassword to be utilized in our Passport strategy which verifies login credentials. The User model also has a 'beforeCreate' hook which means that right before a user is created, we perform some kind of function, in this case we salted and hashed the user's password to be stored in our database. 

Now that the app is running a use can go to the home page and create an account. The registration form sends a POST request which calls a Sequelize method to create a new user based on the form info. Once the user is created, a 307 redirect is sent to the login route. This is where the Passport authentication comes in. Using passport.authenticate('local') as an app-specific middleware will pass the request payload containing the username/password to our local strategy where we've defined a method of verifying login credentials with data from our database. Inside this local strategy is where we use Sequelize to find the input username, as well as call the validPassword method defined in our model to validate the input password. The local strategy returns a callback function with the verified user as an argument if authentication succeeded. 

Once the form, which initially sent the POST request to the signup route, receives the response, the window reloads with the members page. The members page has its own GET request route handler, which also contains an app-specific middleware function, isAuthenticated. I believe this checks to see if the user exists in the current session. If you look at server.js, you'll see some middleware that sets the req.user property to the deserialized user object which isAuthenticated checks for. The serialized user object is stored in a memorystore instance on the server-side, while the corresponding serialized session id is stored in a cookie on the client-side. This connection is what allows users to remain logged in during a given session (in this case as long as the app is still running). 

## Recap
To recap, we used Passport js to authenticate user login, Bcrypt js to salt and hash user passwords for safe storage, and Sequelize to fetch data from and edit our MySQL database. 

## Questions
* [kvn.luo@gmail.com](kvn.luo@gmail.com)
