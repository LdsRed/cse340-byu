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

module.exports = invCont;