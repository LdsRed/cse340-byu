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
        .notEmpty().withMessage("Email field is required")
        .isEmail().withMessage("A valid Email is required. Please, check your email")
        .normalizeEmail(),

        // Password is required and must be strong password
        body("account_password")
        .trim()
        .notEmpty().withMessage("Password is required")
        .isStrongPassword({
            minLength: 12,
        })
    ]
}
/* ***************************************************************
 * Check Login fields and return errors or continue to registration
 * ************************************************************* */
validate.checkLoginData = (req, res, next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){

        const fieldErrors = errors.array().reduce( (acc, err) => {
            acc[err.param] = [...(acc[err.param] || []), err.msg];
            return acc;
        }, {});

        req.flash('fieldErrors', fieldErrors);
        req.flash('oldData', { account_email: req.body.account_email})
        return res.redirect("/account/login");
    }

    next();
};



/* ***************************************************************
 * Check Login credentials and return errors or continue to registration
 * ************************************************************* */

validate.checkLoginCredentials = async function(req, res, next) {
    const { account_email, account_password } = req.body;

    try{

        const user = await accountModel.findByEmail(account_email);

        if(!user) {
            req.flash('error', "Please check your credentials and try again.");
            req.flash('oldData', {account_email});
            return res.redirect("/account/login");
        }

        const isValid = await accountModel.comparePassword(account_password, user.account_password);

        if(!isValid){
            req.flash('error', "Please check your password and try again.");
            req.flash('oldData', {account_email});
            res.redirect("/account/login");
        }

        req.user = user;
        next();

    }catch (error) {
        req.flash('error', "Please check your credentials and try again.");
        req.flash('oldData', {account_email});
        res.redirect("/account/login");
    }
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
            .notEmpty().withMessage("Please provide a first name.")
            .isLength({ min: 1 }).withMessage("Last name too short"),

        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty().withMessage("Please provide a last name.")
            .isLength({ min: 2 }).withMessage("Last name too short"), // on error this message is sent.

        // valid email is required and cannot already exist in the DB
        body("account_email")
            .notEmpty().withMessage("Email field is required")
            .isEmail().withMessage("A valid Email is required. Please, check your email")
            .normalizeEmail()
            .custom(async (value) => {
                const user = await accountModel.findByEmail(value);
                if (user) {
                    throw new Error("Email already exists");
                }
                return true;
            }),

        // password is required and must be strong password
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
            .withMessage("Password does not meet requirements."),

        body("confirm_password")
            .trim()
            .notEmpty().withMessage("Please confirm your password")
            .custom( (value, {req}) => {
                if(value !== req.body.account_password){
                    throw new Error("Passwords do not match")
                }
                return true;
            })

    ]
}


/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */

validate.validateRegistrationData = async (req, res, next) => {
    

    let errors = validationResult(req)

    if (!errors.isEmpty()) {

        const fieldErrors = {}
        errors.array().forEach((error) => {
            if(!fieldErrors[error.param]){
                fieldErrors[error.param] = [];
            }
            fieldErrors[error.param].push(error.msg);
        });
        
        req.flash('fieldErrors', fieldErrors);
        req.flash('oldData', req.body);

        return res.redirect("/account/register");
    }
    next()
};


module.exports = validate;