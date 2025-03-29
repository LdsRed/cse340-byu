const utilities = require(".");
const {body, validationResult} = require("express-validator");
const validate = {};


/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */

validate.registationRules = () => {
    return [

        //First name is required and must be string
        body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({min: 1})
        .withMessage("First name is required"),

        // Last name is required and must be string
        body("account_lastnmae")
        .trim()
        .escape()
        .notEmpty()
        .isLength({min: 2})
        .withMessage("Last Name is required"),

        
        // Email is required and cannot already exist in the DB
        body("account_email")
        .trim()
        .escape()
        .notEmpty()
        .isEmail()
        .normalizeEmail()
        .withMessage("A valid Email is required. Please, check your email"),



        // Password is required and must be strong password
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
        .withMessage("Password does not meet the requirements"),
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */

validate.checkRegData = async (req, res, next) => {
    const {account_firstname, account_lastnmae, account_email} = req.body;
    let errors = [];
    errors = validationResult(req);

    if(!errors.isEmpty()){
        let nav = await utilities.getNav();
        res.render("account/register", {
            errors,
            title: "Register",
            nav,
            account_firstname,
            account_lastnmae,
            account_email,
        })

        return
    }

    next();
}


module.exports = validate;