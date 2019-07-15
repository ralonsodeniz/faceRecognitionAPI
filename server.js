const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs"); // bcrypt-nodejs module to encrypt password in hashes
const cors = require("cors"); // npm package to avoid Acess-Control-Allow-Origin error
const knex = require("knex"); // middleware to communicate with databases npm install knex, it alsa needs npm install pg to communicate with postgreSQL
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = knex({
  // configuration for the module to connect to the db
  client: "pg", // this is for postgreSQL
  connection: {
    connectionString: process.env.DATABASE_URL, // this is for heroko configuration of postgreSQL if we are using local db use host: localhost here
    ssl: true
    // user: "postgres", // this is not needed with heroku postgreSQL config, it's for local installation
    // password: "lolitall",
    // database: "smart-brain"
  }
});

const app = express();
app.use(bodyParser.json()); // remember that body-parser is a middleware so we invoke it with .use() method
// remember that if we want to access the json data sent in the body we have to parse it using body-parser othrwise we will get an error
app.use(cors()); // cors is another middleware

app.get("/", (req, res) => {
  db.select("*")
    .from("users")
    .then(data => {
      res.json(data);
    });
  // res.send("it is working");
});

app.post("/signin", signin.handleSignin(db, bcrypt)); // this is currying, post allways have req, res, so with this syntax we run handleSignin with db and bcrypt and returns a new function that is executed with req and res. remember when we do .then(console.log) a promise always has a response and if we use that syntax the function console.log automatically runs with the response, in this case is the same for the execution of the second part of the curried function
// this is the shorthand of app.post("/signin", (req, res) => signin.handleSignin(db, bcrypt)(req, res));
// this is the same as  app.post("/signin", (req,res) => {signin.handleSignin(req,res,db,bcrypt)}) and we had to change also in the signin.js file the header of the function to const handleSignin = (req,res,db,bcrypt) => {}

app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt); // now we have the register server side functionality in its own file
}); // this is called dependencies injection to the function call, we have added to the function call the db and bcrypt const that are needed for its execution

app.get("/profile/:id", (req, res) => {
  //remeber that the syntax :id will allow us to input in the browser /profile/whatever and grab whatever as id through request.params property
  profile.handleProfileGet(req, res, db);
});

app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res);
});

app.listen(process.env.PORT || 3000, () => {
  // the second parameter is a function that executes once the server starts listening
  console.log(`app is runing on port ${process.env.PORT}`);
});

/*
/ --> GET requests that responses this is working
/signin --> POST request with data from the loggin that responses success/fail / here even when we are not adding new data since the user has to already exist to log in we use POST because we don't want to send a query string as sign in info because the data is shown in the url
/register --> POST request to add data of a new user and responses the new user object
/profile/:userid --> GET request that responses the user
/image --> PUT request that responses the new user info
*/

//bcrypt-nodejs is a library that allows us to create a very secure login storing the password encrypted in a hash
