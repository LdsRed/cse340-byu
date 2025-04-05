const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function(req, res, next){
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    });
}


invCont.getVehicleDetails = async function(req, res, next){
    const inventoryId = req.params.inventory_id;

    try {
        const vehicleData = await invModel.getVehicleById(inventoryId);
        if(!vehicleData){
            return res.status(404).send("Vehicle not found");
        }

        // Generate the html using utilities
        const inventoryDetailHtmlContent = await utilities.buildInventoryDetail(vehicleData);

        let nav = await utilities.getNav();
        const make = vehicleData[0].inv_make;
        const model = vehicleData[0].inv_model;

         // Render the detail view
        res.render("./inventory/details", {
            title: `${make} ${model}`,
            nav,
            content: inventoryDetailHtmlContent
            })

    } catch (error) {
        console.error('Error retrieving vehicle details:', error);
        res.status(500).send('Internal Server Error');
    }

}


invCont.buildVehicleManagementView = async function(req, res, next){
    let nav = await utilities.getNav();

    try{
        res.render("./inventory/management", {
            title: "Vehicle Management",
            message: req.flash(),
            errors: null,
            nav,
        })
    } catch (error) {
        next(error);
    }
}

//Build Add Classification view

invCont.buildAddClassificationView = async function(req, res, next) {
    let nav = await utilities.getNav();
    try {
        res.render("./inventory/add-classification", {
            title: "Add Classification",
            messages: null,
            errors: null,
            nav,
        })
    } catch (error) {
        next(error);
    }
}

// Process a new classification form submission
invCont.addClassification = async function(req, res, next){
    let nav = await utilities.getNav();

    try {
        // Insert the new Classification to the DB
            await invModel.addNewVehicleClassification(req.body.classification_name);
            req.flash("success", "The new Classification was added successfully!" );
            res.redirect("/inv/")
    } catch (error) {
        req.flash("error", "The new Classification could not be added. Please try again.");
        res.render("./inventory/add-classification", {
            title: "Add Classification",
            message: req.flash(),
            errors: null,
            nav,
        })
    }
}


//Build Add Vehicle Inventory view
invCont.buildAddVehicleInventoryView = async function(req, res, next) {
    let nav = await utilities.getNav();

    try {

        const classificationList = await utilities.buildClassificationList();

        res.render("./inventory/add-inventory", {
            title: "Add Vehicle Inventory",
            classificationList,
            message: req.flash(),
            errors: null,
            nav,
            // All fields must be initialized to empty strings
            inv_make: "",
            inv_model: "",
            inv_year: "",
            inv_description: "",
            inv_image: '/images/vehicles/no-image.png',
            inv_thumbnail:  '/images/vehicles/no-image-tn.png',
            inv_price: "",
            inv_miles: "",
            inv_color: "",
        })
    } catch (error) {
        next(error);
    }
}


invCont.addInventory = async function(req, res, next){
    let nav = await utilities.getNav();

    try {

         await invModel.addNewVehicleInventory(req.body);
         req.flash("success", "The new vehicle was added successfully!");
         res.redirect("/inv/");

    }catch (error){
        req.flash("error", "The new vehicle could not be added. Please try again.");
        let classificationList = await utilities.buildClassificationList(req.body.classification_id);
        res.render("./inventory/add-inventory", {
            title: "Add Vehicle Inventory",
            classificationList,
            message: {type: "error", message: "The new vehicle could not be added. Please try again."},
            errors: null,
            nav: await utilities.getNav(),
            inv_make: req.body.inv_make,
            inv_model: req.body.inv_model,
            inv_year: req.body.inv_year,
            inv_description: req.body.inv_description,
            inv_image: req.body.inv_image,
            inv_thumbnail: req.body.inv_thumbnail,
            inv_price: req.body.inv_price,
            inv_miles: req.body.inv_miles,
            inv_color: req.body.inv_color,
            classification_id: req.body.classification_id
        })
    }
}

invCont.deleteInventory = async function(req, res, next) {

}

module.exports = invCont;