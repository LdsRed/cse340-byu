const invModel = require("../models/inventory-model");
const reviewModel = require("../models/review-model");
const utilities = require("../utilities/");
const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function(req, res, next){
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildDetailsGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
        messages: req.flash(),
        errors: null,
    });
}


invCont.getVehicleDetails = async function(req, res, next){
    const inventoryId = req.params.inventory_id;

    try {
        const vehicleData = await invModel.getInventoryById(inventoryId);
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
            messages: req.flash(),
            content: inventoryDetailHtmlContent
            })

    } catch (error) {
        console.error('Error retrieving vehicle details:', error);
        res.status(500).send('Internal Server Error');
    }

}

/* ***************************
 *  Build Inventory Management view
 * ************************** */
invCont.buildByInvManagement = async function(req, res, next){
    try{
        res.render("./inventory/management", {
            title: "Vehicle Management",
            message: req.flash(),
            errors: null,
            nav: await utilities.getNav(),
            classificationSelect: await utilities.buildClassificationList(),
        })
    } catch (error) {
        next(error);
    }
}

/* ***************************
 *  Build Inventory Management view
 * ************************** */
invCont.buildByAddClassification = async function(req, res, next) {
    let nav = await utilities.getNav();
    try {
        res.render("./inventory/add-classification", {
            title: "Add Classification Management",
            errors: null,
            messages: req.flash(),
            nav,
        })
    } catch (error) {
        next(error);
    }
}

/* ***************************
 *  Process Add Classification
 * ************************** */
invCont.addClassification = async function(req, res, next){
    let nav = await utilities.getNav();
    const {classification_name} = req.body;
    try {
            await invModel.addNewVehicleClassification(classification_name);
            req.flash("success", "The new Classification was added successfully!" );
            res.status(201).render('inventory/management', {
                title: 'Inventory Management',
                nav,
                errors: null,
            })
    } catch (error) {
        req.flash("notice", "The new Classification could not be added. Please try again.");
        res.status(501).render("./inventory/add-classification", {
            title: "Add Classification Management",
            nav,
            messages: req.flash(),
            errors: null,
        })
    }
}


/* ***************************
 *  Build Add Inventory view
 * ************************** */
invCont.buildByAddInventory = async function(req, res, next) {
    let nav = await utilities.getNav();
    try {
        const classificationList = await utilities.buildClassificationList();
        res.render("./inventory/add-inventory", {
            title: "Add Vehicle Inventory",
            classificationList,
            errors: null,
            messages: req.flash(),
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
        req.flash('notice', 'There was an error processing your request. Please try again.');
        next(error);
    }
}

/* ***************************
 *  Process Add Inventory
 * ************************** */
invCont.addInventory = async function(req, res, next){
    const {
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
    } = req.body;
    try {
         await invModel.addNewVehicleInventory(
             inv_make,
             inv_model,
             inv_year,
             inv_description,
             inv_image,
             inv_thumbnail,
             inv_price,
             inv_miles,
             inv_color,
             classification_id
         );
         req.flash("success", `Congratulations! ${inv_make} ${inv_model} has been added to the inventory.`);
         res.status(201).render('inventory/management', {
             title: 'Inventory Management',
             nav: await utilities.getNav(),
             messages: req.flash(),
             classificationSelect: await utilities.buildClassificationList(),
             errors: null,
         })

    }catch (error){
        req.flash('notice', 'There was an error while processing the inventory. Please try again.');
        res.status(501).render('inventory/add-inventory', {
            title: 'Add Inventory Management',
            nav: await utilities.getNav(),
            classificationSelect: await utilities.buildClassificationList(),
            errors: error,
        })
    }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) =>{
    const classification_id = parseInt(req.params.classification_id);
    const invData = await invModel.getInventoryByClassificationId(classification_id);
    if(invData[0].inv_id) {
        return res.json(invData);
    }else {
        next(new Error("No data returned"))
    }
}

/* ***************************
 *  Build Edit/Update Inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryByClassificationId(inv_id)
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/edit-inventory", {
        title: `Edit Inventory - ${itemName}`,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id: itemData[0].inv_id,
        inv_make: itemData[0].inv_make,
        inv_model: itemData[0].inv_model,
        inv_year: itemData[0].inv_year,
        inv_description: itemData[0].inv_description,
        inv_image: itemData[0].inv_image,
        inv_thumbnail: itemData[0].inv_thumbnail,
        inv_price: itemData[0].inv_price,
        inv_miles: itemData[0].inv_miles,
        inv_color: itemData[0].inv_color,
        classification_id: itemData[0].classification_id,
        messages: req.flash(),
    })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
    } = req.body
    const updateResult = await invModel.updateInventory(
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
    )

    if (updateResult) {
        const itemName = updateResult.inv_make + " " + updateResult.inv_model
        req.flash("notice", `The ${itemName} was successfully updated.`)
        res.redirect("/inv/")
    } else {
        const classificationSelect = await utilities.buildClassificationList(classification_id)
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the insert failed.")
        res.status(501).render("inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            classificationSelect: classificationSelect,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
            messages: req.flash(),
        })
    }
}

/* ***************************
 *  Build Delete Inventory view
 * ************************** */
invCont.buildByDeleteInventory = async function(req, res, next) {
    const inv_id = parseInt(req.params.inventoryId);
    const itemData = await invModel.getInventoryById(inv_id);
    let nav = await utilities.getNav();
    const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`;
    res.render("./inventory/delete-inventory", {
        title: `Delete Inventory - ${itemName}`,
        nav,
        errors: null,
        inv_id: itemData[0].inv_id,
        inv_year: itemData[0].inv_year,
        inv_make: itemData[0].inv_make,
        inv_model: itemData[0].inv_model,
        inv_price: itemData[0].inv_price,
        messages: req.flash(),
    })
}

/* ***************************
 *  Process Delete Inventory data
 * ************************** */
invCont.deleteInventory = async function(req, res, next) {
    const { inv_id, inv_make, inv_model, inv_price,inv_year, inv_miles } = req.body;
    const deleteResult = await invModel.deleteInventory(inv_id, inv_make, inv_model, inv_price,inv_year, inv_miles);
    if (deleteResult) {
        const itemName = deleteResult.inv_make + " " + deleteResult.inv_model;
        req.flash("success", `The ${itemName} was successfully deleted.`);
        res.redirect("/inv/");
    } else {
        const itemName = `${inv_make} ${inv_model}`;
        req.flash("notice", "Sorry, the delete failed.");
        res.status(501).render("inventory/delete-inventory", {
            title: "Delete " + itemName,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_price,
            inv_miles,
            messages: req.flash(),
        })
    }
}

module.exports = invCont;