/* ******************************************
* Account Routes
* Unit 4, deliver login view activity
* ******************************************/
// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");


/* ******************************************
* Deliver Login View
* Unit 4, deliver login view activity
* ******************************************/

// GET /login - Show login page
router.get("/login", utilities.handleErrors(accountController.buildLogin));
// POST /login - Handle login form submission
router.post("/login", utilities.handleErrors(accountController.submitLogin));
// GET /logout - Handle user logout
router.get("/logout", utilities.handleErrors(accountController.logout));


// Registration routes
router.get("/register", utilities.handleErrors(accountController.buildRegister));
// Register a user
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount));

module.exports = router;