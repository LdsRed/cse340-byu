/* ******************************************
* Account Controller
* Unit 4, deliver login view activity
* ******************************************/
const utilities = require('../utilities');
const accountModel = require('../models/account-model');
const bcrypt = require('bcrypt');
/* ******************************************
* Deliver Login View
* Unit 4, deliver login view activity
* ******************************************/

async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null
    })
}

/* ******************************************
* Deliver Register View
* Unit 4, deliver register view activity
* ******************************************/


async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null
    })
}


/* ******************************************
* Handle login form submission
* Unit 4
* ******************************************/
async function submitLogin(req, res) {
    try {
        const { account_email, account_password } = req.body;

        // Find the user by Email
        const user = await accountModel.findByEmail(account_email);

        if(!user){
            return res.render("account/login", {
                title: "Login",
                nav: await utilities.getNav(),
                errors: "Invalid email or password"
            });
        }

        // Validate the password
        const isValidPassword = await accountModel.comparePassword(account_password, user.account_password);
        
        if(!isValidPassword){
            return res.render("account/login", {
                title: "Login",
                nav: await utilities.getNav(),
                errors: "Invalid email or password"
            });
        }

        // Set the user session
        req.session.userId = user.account_id;
        req.session.isAuthenticated = true;

        // Redirect to home page
        res.redirect('/');
    } catch(error) {
        console.error("Login error: ", error);
        res.render("account/login", {
            title: "Login",
            nav: await utilities.getNav(),
            errors: "An error occurred during login"
        });
    }
}

async function logout(req, res){
    req.session.destroy( (err) => {
        if(err){
            console.error("Logout error: ", err);
        }
        res.redirect("/login");
    });
}


/* ******************************************
* Process Registration
* Unit 4
* ******************************************/


async function registerAccount(req, res) {
    let nav = await utilities.getNav();
    const {
        account_firstname,
        account_lastnmae,
        account_email,
        account_password,
        confirm_password
    } = req.body;

    try {
        // Validate password confirmation
        if (account_password !== confirm_password) {
            req.flash("notice", "Passwords do not match");
            return res.status(400).render("account/register", {
                title: "Register",
                nav,
                errors: null
            });
        }

        const regResult = await accountModel.registerUser({
            account_firstname,
            account_lastnmae,
            account_email,
            account_password
        });

        if(regResult) {
            req.flash(
                "notice",
                `Congratulations. You're registered ${account_firstname}. Please, log in.`
            );

            res.status(201).render("account/login", {
                title: "Login",
                nav,
                errors: null
            });
        }
    } catch(error) {
        req.flash("notice", "Sorry, the registration failed.");
        console.error("Error: " + error.message);
        res.status(500).render("account/register", {
            title: "Register",
            nav,
            errors: null
        });
    }
}


module.exports = {buildLogin, buildRegister, submitLogin, logout, registerAccount}