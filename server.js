/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require('express');
const session = require('express-session');
const pool = require('./database/')
const env = require("dotenv").config();
const expressLayouts = require("express-ejs-layouts");
const app = express();
const static = require("./routes/static");
const inventoryRoute = require("./routes/inventoryRoute");
const errorRoute = require("./routes/errorRoute");
const utilities = require("./utilities/");
const baseController = require('./controllers/baseController');
const invController = require('./controllers/invController');
const errorMiddleware = require("./middleware/errorMiddleware");
//Body parser
const bodyParser = require("body-parser");





/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout")

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',

}))

app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));


//Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
})


/* ***********************
 * Routes
 *************************/
app.use(express.static('public'));
//Index Route -Unit 3, activity
app.get("/", utilities.handleErrors(baseController.buildHome));
//Inventory Routes - Unit 3, activity
app.use("/inv", inventoryRoute);
// Inventory details route - Unit 3, activity
// Account routes - Unit 4, activity
app.use("/account", require("./routes/accountRoute"));


/* ***********************
* File Not Found Route - Must be last route in list
* Place after all routes
* Unit 3, Basic Error Handling Activity
*************************/
app.use(async (req, res, next) =>{
  next({
    status: 404,
    message: `Sorry, we appear to have lost that page. Try with a different Route.`
  })
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/

//app.use(errorMiddleware);

app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  let message
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);

  if(err.status === 404) {
    message = err.message
  } else {
    message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server error',
    message,
    nav
  })
})


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
})