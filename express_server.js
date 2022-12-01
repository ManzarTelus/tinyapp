const express = require("express");
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 8080; // default port 8080

// set the view engine to ejs
app.set("view engine", "ejs");

app.use(cookieParser());
app.use(morgan('dev'));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.use(express.urlencoded({ extended: true }));

//Returns a string of 6 random alphanumeric characters:
const generateRandomString = () => {
  return Math.random().toString(36).substring(6);
};


//Delete Method to delete a url from the database.
app.post('/urls/:id/delete', (req, res) => {
  const urlId = req.params.id;

  // delete that url from the database
  delete urlDatabase[urlId];

  // redirect to the list of urls
  res.redirect("/urls");
});

// create the update route => when the user clicks on update from the show page
app.post('/urls/:id', (req, res) => {
  // extract the id from the path of the url
  const urlId = req.params.id;

  // extract the user input from the form (post data)
  // req.body
  const longURL = req.body.longURL;

  // update our db for that url
  urlDatabase[urlId] = longURL;
  res.redirect(`/urls`);
});

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

// Following three get methods update for Cookies in Expres Assignment
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {username: req.cookies["username"]};//username cookie
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: req.cookies["username"]}; // username cookie
  res.render("urls_show", templateVars);
});

// added 2 post methods for "login" and "logout"
app.post('/login', (req, res) => {
  const username = req.body.username;
  res.cookie('username', username);
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  const username = req.body.username;
  res.clearCookie('username', username);
  res.redirect('/urls');
});

// Method for registartion form
app.get("/register", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
  };
  res.render("register", templateVars);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

/*
previous exercises:
app.get("/hello", (req, res) => {
  const templateVars = { greeting: "Hello World!" };
  res.render("hello_world", templateVars);
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});*/
 

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
