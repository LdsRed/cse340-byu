const utilities = require(".");
const {body, validationResult} = require("express-validator");
const {max} = require("pg/lib/defaults");
const invValidator = {};

/*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */


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

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */

invValidator.validateClassification = async  (req, res, next)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.render("inventory/add-classification", {
            title: "Add Classification",
            errors: errors.array(),
            message: req.flash("error", "Please correct the errors below"),
            nav: await utilities.getNav(),
            classification_name: req.body.classification_name
        })
    }
    next();

}

/*  **********************************
  *  Inventory Validation Rules
  * ********************************* */

invValidator.inventoryRules = () => {

    return [

        body("inv_make")
            .trim()
            .notEmpty().withMessage("Make is required")
            .escape(),
        body("inv_model")
            .trim()
            .notEmpty().withMessage("Model is required")
            .isLength({min: 3}).withMessage("Model must be at least 3 characters")
            .escape(),
        body("inv_year")
            .notEmpty().withMessage("Year is required")
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
    ];
};


/*  **********************************
  *  Validate Inventory data
  * ********************************* */

invValidator.validateInventory = async (req, res, next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        let classificationList;

        try {
            classificationList = await utilities.buildClassificationList(req.body.classification_id)
        } catch (error) {
            classificationList = await utilities.buildClassificationList();
        }

        // Prepare view data with sticky form values
        const viewData = {
            title: "Add Inventory",
            nav: await utilities.getNav(),
            errors: errors.array(),
            message: null,
            classificationList,
            inv_make: req.body.inv_make,
            inv_model: req.body.inv_model,
            inv_year: req.body.inv_year,
            inv_description: req.body.inv_description,
            inv_image: req.body.inv_image || "/images/vehicles/no-image.png",
            inv_thumbnail: req.body.inv_thumbnail || "/images/vehicles/no-image-tn.png",
            inv_price: req.body.inv_price,
            inv_miles: req.body.inv_miles,
            inv_color: req.body.inv_color,
            classification_id: req.body.classification_id
        };

        return res.render("./inventory/add-inventory", viewData);
    }
    next();
}



/*  **********************************
  *  Rules for Updated Inventory
  * ********************************* */

invValidator.newInventoryRules = () => {
    return [
        ...invValidator.inventoryRules(),

        body("inv_id")
            .notEmpty().withMessage("Inventory ID is required")
    ];
};



/*  **********************************
  *  If there are errors, the user will be redirected to the Edit view
  * ********************************* */

invValidator.checkUpdateData = async (req, res, next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        let classificationList;

        try {
            classificationList = await utilities.buildClassificationList(req.body.classification_id)
        } catch (error) {
            classificationList = await utilities.buildClassificationList();
        }

        // Prepare view data with sticky form values
        const viewData = {
            title: "Edit Inventory",
            nav: await utilities.getNav(),
            errors: errors.array(),
            message: null,
            classificationList,
            inv_id: req.body.inv_id,
            inv_make: req.body.inv_make,
            inv_model: req.body.inv_model,
            inv_year: req.body.inv_year,
            inv_description: req.body.inv_description,
            inv_image: req.body.inv_image || "/images/vehicles/no-image.png",
            inv_thumbnail: req.body.inv_thumbnail || "/images/vehicles/no-image-tn.png",
            inv_price: req.body.inv_price,
            inv_miles: req.body.inv_miles,
            inv_color: req.body.inv_color,
            classification_id: req.body.classification_id
        };

        return res.render("./inventory/edit-inventory", viewData);
    }
    next();
};


module.exports = invValidator;