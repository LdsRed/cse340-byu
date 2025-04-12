const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const profileController = require("../controllers/profileController");


router.get(
    "/profile",
    utilities.checkUserLoggedIn,
    utilities.handleErrors(profileController.buildProfile))

router.get(
    "/profile/edit",
    utilities.checkUserLoggedIn,
    utilities.handleErrors(profileController.buildEditProfile));

router.post(
    "/profile/update",
    utilities.checkUserLoggedIn,
    utilities.handleErrors(profileController.updateProfile))

router.get(
    "/profile/change-password",
    utilities.checkUserLoggedIn,
    utilities.handleErrors(profileController.buildChangePassword));

router.post(
    "/profile/update-password",
    utilities.checkUserLoggedIn,
    utilities.handleErrors(profileController.updatePassword));


module.exports = router;