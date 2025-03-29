const utilities = require(".");
const {body, validationResult} = require("express-validator");
const {max} = require("pg/lib/defaults");
const invValidator = {};




invValidator.classificationRules = () => {
    //Classification name is required
    return [
    body("classification_name")
        .trim()
        .notEmpty()
        .withMessage("Classification name is required")
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage("No spaces or special characters allowed")

    ]
}
invValidator.validateClassification = async  (req, res, next)=>{

    const errors = validationResult(req);
    if(errors.isEmpty()){
        return next();
    }

    req.flash("error", "Please correct the errors below")
    res.render("inventory/add-classification", {
        title: "Add Classification",
        errors: errors.array(),
        messages: req.flash(),
        nav: await utilities.getNav()

    })
}



invValidator.inventoryRules = () => {

    return [

        body("inv_make")
            .trim()
            .notEmpty()
            .withMessage("Make is required")
            .escape(),
        body("inv_model")
            .trim()
            .notEmpty().withMessage("Model is required")
            .isLength({min: 3}).withMessage("Model must be at least 3 characters")
            .escape(),
        body("inv_year")
            .isInt({
                min: 1900,
                max: new Date().getFullYear() + 1
            })
            .withMessage("Year must be between 1900 and the current year"),
        body("inv_description")
            .trim()
            .notEmpty().withMessage("Description is required")
            .isLength({
                min: 10}).withMessage("Description must be at least 10 characters"),
        body("inv_price")
            .isFloat({
                min: 1})
            .notEmpty().withMessage("Price is required")
            .withMessage("Price must be at least 1.00"),
        body("inv_miles")
            .notEmpty().withMessage("Miles is required")
            .isInt({min: 0}).withMessage("Miles must be a positive number"),
        body("inv_color")
            .trim()
            .notEmpty().withMessage("Color is required")
            .escape(),

        body("classification_id")
            .notEmpty().withMessage("Classification is required"),
    ]
}



invValidator.validateInventory = (req, res, next) => {

    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

       const errorMessages = errors.array().map(error => error.msg);
    req.flash('error', 'There were errors in the form:');

    res.render('inventory/add-inventory', {
        title: 'Add Inventory',
        errors: errors.array(),
        messages: req.flash(),
        ...req.body,
        classificationList: res.locals.classificationList || ''
    });
}


module.exports = invValidator;