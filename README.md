
# reverse-engineer-code

## High-Level Overview
This is a simple login application that implements Passport js to authenticate user logins, and uses Sequelize to interact with our database. While the actual users are stored in a MySQL database, the session data is stored in a memory store instance (Express js default) which resets on every app relaunch. Additionally, by using Bcrypt js, we stored the hashed and salted user passwords in the database. The purpose of this readme is to reverse-engineer the application code and provide an explanation for how it works.

## The Nuts and Bolts
In server.js, we initialize our express app and configure the necessary middleware for it to run (eg passport, session, express.json etc.). At the very end of this file we connect to our MySQL database, and only after successfully connecting to it do we begin listening for requests to our express app server. The index.js file in the models folder is how we are able to connect to our database. Index.js checks the configuration paramaters from config.json, then creates tables (if they don't already exist) in our database based on the other models saved in the models folder. 

The model files specify the column names, data types, constraints, and validations, as well as lays out relationships with other tables.  In this case we only had User.js. In User.js, we added an instance method called validPassword to be utilized in our Passport strategy which verifies login credentials. The User model also has a 'beforeCreate' hook which means that right before a user is created, we perform some kind of function, in this case we salted and hashed the user's password to be stored in our database. 

## Questions
* [kvn.luo@gmail.com](kvn.luo@gmail.com)
