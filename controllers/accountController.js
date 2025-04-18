/* ******************************************
* Account Controller
* Unit 4, deliver login view activity
* ******************************************/
const utilities = require('../utilities');
const accountModel = require('../models/account-model');
const reviewModel = require("../models/review-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const e = require("express");
require("dotenv").config();

const accountController = {};


/* ******************************************
* Deliver Login View
* ******************************************/

accountController.buildLogin = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        res.render('account/login', {
            title: 'Login',
            nav,
            account_email: req.body.account_email,
            errors: null,
        })
    } catch (error){
        req.flash("error", "There was a problem logging in. Please try again.")
    }
}

/* ****************************************
 *  Deliver Registration view
 * *************************************** */
accountController.buildRegistration = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render('account/registration', {
        title: 'Registration',
        nav,
        errors: null,
    })
}


/* ****************************************
 *  Deliver Logout view
 * *************************************** */

accountController.buildLogoutView = async function(req, res, next){
    req.flash("notice", "You are already logged in, do you want to log out?");
    try {
        res.render("account/logout-view", {
            title: "User Session",
            nav: await utilities.getNav(),
            messages: req.flash(),
            errors: null
        })
    }catch (error) {
        next(error);
    }
}

/* ****************************************
 *  Deliver Account Management view
 * *************************************** */

accountController.buildManagement = async function (req, res, next) {
    const account_id = res.locals.accountData?.account_id ? parseInt(res.locals.accountData.account_id) : null
    const reviewData = await reviewModel.getReviewsByIdOnly(account_id)
    const myReviews = await utilities.buildMyReviews(reviewData)
    let nav = await utilities.getNav()
    res.render('account/management', {
        title: 'Account Management',
        nav,
        myReviews,
        messages: req.flash(),
        errors: null,
    })
}

/* ******************************************
* Process Registration
* ******************************************/
accountController.registerAccount = async function (req, res) {
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
            await accountModel.registerUser({
            account_firstname,
            account_lastname,
            account_email,
            account_password
        });

        req.flash("success", `Congratulations, you\'re registered ${account_firstname}. Please log in.`)
        res.status(201).render('account/login', {
            title: "Login",
            nav,
            messages: req.flash(),
            errors: null
        })

    }catch (error) {
        req.flash('notice', 'Something went wrong. Please try again.');
        res.status(501).render('account/registration', {
            title: "Registration",
            nav,
            messages: req.flash(),
            errors: null,
        })
    }
}


/* ******************************************
* Process Login request
* ******************************************/
accountController.accountLogin = async function(req, res) {
    const {account_email, account_password} = req.body;
    const accountData = await accountModel.findByEmail(account_email);
    if(!accountData) {
        req.flash('notice', 'Login failed. Please check your credentials and try again.');
        res.status(400).render('account/login', {
            title: "Login",
            nav: await utilities.getNav(),
            errors: null,
            messages: req.flash(),
            account_email,
        })
        return;
    }

    try{
        if(await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password;
            const accessToken = jwt.sign(accountData, process.env.JWT_SECRET, {expiresIn: 3600 * 1000})
            if (process.env.NODE_ENV === "development") {
                res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 * 1000});
            } else {
                res.cookie("jwt", accessToken, {httpOnly: true, secure: true, maxAge: 3600 * 1000});
            }
            return res.redirect('/account/');
        }else {
            req.flash('notice', 'Login failed. Please check your credentials and try again.');
            res.status(400).render('account/login', {
                title: "Login",
                nav: await utilities.getNav(),
                errors: null,
                messages: req.flash(),
                account_email,
            })
        }
    } catch(error) {
        throw new Error('Access Forbidden');
    }
}

/* ***********************
 * Deliver Update Account View
 *************************/
accountController.buildUpdateAccountView = async function(req, res) {
    let nav = utilities.getNav();
    const accountData = await accountModel.findById(req.params.account_id);
    res.render('account/update-account', {
        title: 'Update Account Information',
        nav,
        accountData,
        messages: req.flash(),
        account_id: accountData.account_id,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
        account_type: accountData.account_type,
        errors: null,
    })
}

/* ***********************
 * Process Update Account
 *************************/
accountController.updateAccountInfo = async function(req, res) {
    const {account_firstname, account_lastname, account_email, account_id} = req.body;
    try {
        await accountModel.updateAccountInfo(
            account_firstname,
            account_lastname,
            account_email,
            account_id,
        );
        req.flash('success', 'Your account information has been updated.');
        res.redirect('/account/');
    }catch (error) {
        req.flash('notice', 'There was an error updating your account information. Please try again.');
        res.status(501).render('account/update-account', {
            title: 'Update Account Information',
            nav: await utilities.getNav(),
            account_firstname,
            account_lastname,
            account_email,
            account_id,
            messages: req.flash(),
            errors: null
        })
        return;
    }
}

/* ****************************************
 *  Update Account Password
 * *************************************** */
accountController.updatePassword = async function(req, res) {
    const { account_password, account_id} = req.body;
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hashSync(account_password, 10);
        await accountModel.updatePassword(hashedPassword, account_id);
        req.flash('success', 'Your password has been updated.');
        res.redirect('/account/');
    }catch (error) {
        req.flash('notice', 'There was an error updating your password. Please try again.');
        res.status(501).render('account/update-account', {
            title: 'Update Account Information',
            nav: await utilities.getNav(),
            messages: req.flash(),
            errors: null
        })
    }
}


/* ****************************************
 *  Process Logout
 * *************************************** */
accountController.logout = async function(req, res) {
    res.clearCookie("jwt");
    res.redirect("/");
}

module.exports = accountController;