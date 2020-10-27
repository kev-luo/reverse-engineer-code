
# reverse-engineer-code

## High-Level Overview
This is a simple login application that implements Passport js to authenticate user logins, and uses Sequelize to interact with our database. While the actual users are stored in a MySQL database, the session data is stored in a memory store instance (Express js default) which resets on every app relaunch. Additionally, by using Bcrypt js, we stored the hashed and salted user passwords in the database. The purpose of this readme is to reverse-engineer the application code and provide an explanation for how it works.

## The Nuts and Bolts


## Questions
* [kvn.luo@gmail.com](kvn.luo@gmail.com)
