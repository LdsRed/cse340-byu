const utilities = require(".");
const accountModel = require("../models/account-model");
const {body, validationResult} = require("express-validator");
const e = require("express");
const validate = {};


/*  **********************************
  *  Login Data Validation Rules
  * ********************************* */
validate.loginRules = () => {
    return [
        // Email is required and cannot already exist in the DB
        body("account_email")
        .trim()
        .escape()
        .notEmpty().withMessage("A valid Email is required. Please, check your email")
        .isEmail()
        .normalizeEmail(),

        // Password is required and must be strong password
        body("account_password")
        .trim()
        .notEmpty().withMessage("Password is required")
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
    ]
}

/* ***************************************************************
 * Check Login data and return errors or continue to registration
 * ************************************************************* */

validate.checkLoginData = async function(req, res, next) {

    const errors = validationResult(req);

    if(!errors.isEmpty()){

        return res.render("account/login", {
            title: "Login",
            nav: await utilities.getNav(),
            errors,
            account_email: req.body.account_email
        })
    }
    next();
}




/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registrationRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."), // on error this message is sent.

        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."), // on error this message is sent.

        // valid email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("A valid email is required."),

        // password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}


/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */

validate.validateRegistrationData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
};


module.exports = validate;