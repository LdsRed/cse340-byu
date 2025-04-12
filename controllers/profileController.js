/* ******************************************
* Account Controller
* Unit 4, deliver login view activity
* ******************************************/
const utilities = require('../utilities');
const profileModel = require('../models/profile-model');
const jwt = require("jsonwebtoken");
require("dotenv").config();




async function buildProfile(req, res) {
    res.render("profile/profile", {
        title: "Profile",
        nav: await utilities.getNav(),
        errors: null
    })
}


async function buildEditProfile(req, res) {
    res.render("profile/edit", {
        title: "Edit Profile",
        nav: await utilities.getNav(),
        errors: null
    })
}


async function updateProfile(req, res) {
    try{
        const {account_firstname, account_lastname, account_email} = req.body;
        await profileModel.updateProfile(req.session.user.id, account_firstname, account_lastname, account_email);
        req.flash("success", "Your profile has been updated.");
        res.redirect("/profile/profile");

    }catch (error){
        req.flash("error", "There was an error updating your profile. Please try again.");
        res.redirect("/profile/edit");
    }
}

async function buildChangePassword(req, res){
    res.render("profile/change-password", {
        title: "Change Password",
        nav: await utilities.getNav(),
        errors: null
    })

}

module.exports = {
    buildProfile,
    buildChangePassword,
    updateProfile,
    buildEditProfile
}