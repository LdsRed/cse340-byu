/* ******************************************
* Account Routes
* Unit 4, deliver login view activity
* ******************************************/
// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const validate = require("../utilities/account-validation");


/* ******************************************
* Deliver Login View
* Unit 4, deliver login view activity
* ******************************************/

// GET /login - Show login page
router.get(
    "/login",
    utilities.checkNotLogged,
    utilities.handleErrors(accountController.buildLogin));
// Unit 5, Login process activity
// POST /login - Handle login form submission

router.get(
    "/logout-view",
    utilities.checkUserLoggedIn,
    utilities.handleErrors(accountController.buildLogoutView));

router.post(
    "/login",
    ...validate.loginRules(),
    validate.checkLoginData,
    validate.checkLoginCredentials,
    utilities.handleErrors(accountController.submitLogin));

// Unit 5, Build Account management view
router.get(
    "/",
    utilities.checkUserLoggedIn,
    utilities.handleErrors(accountController.buildAccountManagementView));

// GET /logout - Handle user logout
router.get(
    "/logout",
    utilities.handleErrors(accountController.logout));


// Registration routes
router.get(
    "/register",
    utilities.handleErrors(accountController.buildRegister));

// Register a user
router.post(
    "/register",
    ...validate.registrationRules(),
    validate.validateRegistrationData,
    utilities.handleErrors(accountController.registerAccount));

module.exports = router;