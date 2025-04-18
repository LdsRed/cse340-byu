/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const env = require('dotenv').config();
const app = express();
const session = require('express-session');
const pool = require('./database/')
const utilities = require('./utilities/');
const baseController = require('./controllers/baseController');
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const reviewRoute = require("./routes/reviewRoute");
const errorRoute = require("./routes/errorRoute");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const flash = require('express-flash');

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

}));

app.use(flash());

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true })); //for parsing application/x-www-form-urlencoded
app.use(utilities.checkJWTToken);


/* ***********************
 * View Engine and Templates
 *************************/
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/layout');



// Express Messages Middleware
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next()
});



/* ***********************
 * Routes
 *************************/
app.use(require('./routes/static'));
// Index route
app.get('/', utilities.handleErrors(baseController.buildHome));
// Inventory routes
app.use('/inv', inventoryRoute)
// Account routes
app.use('/account', accountRoute)
// Review routes
app.use('/review', reviewRoute)
// Error routes
app.use('/error', errorRoute)
// File Not Found Route - must be last route in list
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