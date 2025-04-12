/* ******************************************
* Account Controller
* Unit 4, deliver login view activity
* ******************************************/
const utilities = require('../utilities');
const accountModel = require('../models/account-model');
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


async function buildLogoutView(req, res, next){
    req.flash("notice", "You are already logged in, do you want to log out?");
    try {
        res.render("account/logout-view", {
            title: "User Session",
            nav: await utilities.getNav(),
            errors: null
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
            req.flash("error", "There was an error logging out. Please try again.");
            return res.redirect("/account/logout-view");
        }

        res.clearCookie("jwt");
        req.flash("success", "You have been logged out.");
        return res.redirect("/account/login");
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
        account_lastname,
        account_email,
        account_password,
        confirm_password
    } = req.body;

    try {

        // Register the user
        const regResult = await accountModel.registerUser({
            account_firstname,
            account_lastname,
            account_email,
            account_password
        });

        if (regResult) {
            req.flash(
                "notice",
                `Congratulations, you\'re registered ${account_firstname}. Please log in.`
            )
           return res.redirect("/account/login");
        } else {
            req.flash('error', "Registration failed. Please try again.");
            return res.redirect("/account/register");
        }
    }catch (error){
        req.flash('error', error.message);
        req.flash('oldData', req.body)
        return res.redirect("/account/register");
    }
}

/* ******************************************
* Process Login request
* Unit 5
* ******************************************/
async function submitLogin(req, res) {

    try {

        const user = req.user;
        // Create a JWT token
        const userData = {...user}
        delete userData.account_password;

        const accessToken = jwt.sign(
            userData,
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: 3600 * 1000}
        );


        // Configure the cookie
        if(process.env.NODE_ENV === "development"){
            res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
        }else{
            res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
        }

        req.flash('success', `Welcome back ${user.account_firstname}.`);
        return res.redirect("/account/");
        
    } catch(error) {
        req.flash('error', 'There was an error logging in. Please try again.');
        return res.redirect("/account/login");

    }
}




module.exports = {
    buildLogin,
    buildLogoutView,
    buildRegister,
    submitLogin,
    logout,
    registerAccount,
    buildAccountManagementView}