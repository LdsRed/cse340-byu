const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const {
    classificationRules,
    validateClassification,
    inventoryRules,
    validateInventory,
    checkUpdateData,
    newInventoryRules
} = require("../utilities/inv-validation");
const {handleErrors} = require("../utilities");
const utilities = require("../utilities");




// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build the inventory detail page
router.get("/details/:inventory_id", invController.getVehicleDetails);

// Route to the Vehicle Management
router.get("/", utilities.checkLogin, handleErrors(invController.buildByInvManagement));

//Add Classification routes
router.get("/add-classification", utilities.checkLogin, handleErrors(invController.buildByAddClassification));

// Delete a classification
//router.delete("/delete-classification", handleErrors(invController.deleteClassification))


// Add a new classification
router.post("/add-classification", classificationRules(), validateClassification, handleErrors(invController.addClassification));

//Add Inventory routes
router.get("/add-inventory", utilities.checkLogin, handleErrors(invController.buildByAddInventory));



// Add a new inventory
router.post("/add-inventory", newInventoryRules(), checkUpdateData, handleErrors(invController.addInventory));

// update inventory
router.post("/edit-inventory/", inventoryRules(), validateInventory, handleErrors(invController.updateInventory));

router.get("/getInventory/:classification_id", handleErrors(invController.getInventoryJSON));


module.exports = router;