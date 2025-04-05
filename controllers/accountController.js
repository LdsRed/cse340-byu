/* ******************************************
* Account Controller
* Unit 4, deliver login view activity
* ******************************************/
const utilities = require('../utilities');
const accountModel = require('../models/account-model');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require("dotenv").config();
/* ******************************************
* Deliver Login View
* Unit 4, deliver login view activity
* ******************************************/

async function buildLogin(req, res, next) {
    try {
        res.render("account/login", {
            title: "Login",
            nav: await utilities.getNav(),
            errors: null,
            account_email: req.body.account_email || ""
        })
    }catch (error) {
        next(error);
    }

}

/* ******************************************
* Deliver Register View
* Unit 4, deliver register view activity
* ******************************************/


async function buildRegister(req, res, next) {
    try {
        res.render("account/register", {
            title: "Register",
            nav: await utilities.getNav(),
            errors: null
        });
    } catch (error) {
        next(error);
    }

}


/* ******************************************
* Process Login request
* Unit 5
* ******************************************/
async function submitLogin(req, res) {

    const { account_email, account_password } = req.body;
    // Find the user by Email
    const user = await accountModel.findByEmail(account_email);

    if(!user){
        req.flash("error", "Invalid email or password");
        return res.status(400).render("account/login", {
            title: "Login",
            nav: await utilities.getNav(),
            errors: null,
            account_email
        });
    }

    try {

        // Validate the password

        if(await accountModel.comparePassword(account_password, user.account_password)){
            delete user.account_password;

            // Create the JWT Token
            const accessToken = jwt.sign(user,
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: 3600 * 1000 })
            if(process.env.NODE_ENV === "development"){
                //Set the cookie
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000, secure: true });
            }
            req.flash('success', `Welcome back, ${user.account_firstname} ${user.account_lastname}`);
           return res.redirect("/account/");
        } else {
            req.flash("error", "Please check your credentials and try again.");
            res.status(400).render("account/login", {
                title: "Login",
                nav: await utilities.getNav(),
                errors: null,
                account_email
            })
        }
    } catch(error) {
        throw new Error("Access Forbidden");
    }
}



async function buildAccountManagementView(req, res) {
    res.render("account/account-management", {
        title: "Account Management",
        nav: await utilities.getNav(),
        errors: null
    })
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
    // Register the user
    const regResult = await accountModel.registerUser({
        account_firstname,
        account_lastnmae,
        account_email,
        account_password
    });

    if(regResult) {
        req.flash("success", `Congratulations. You're registered ${account_firstname}. Please, log in.`);
        return res.redirect("/account/login");
    }else {
        req.flash("error", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            fieldErrors: null
        })

    }
}


module.exports = {
    buildLogin,
    buildRegister,
    submitLogin,
    logout,
    registerAccount,
    buildAccountManagementView}