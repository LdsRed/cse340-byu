const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build the inventory detail page
router.get("/details/:inventory_id", invController.getVehicleDetails);

module.exports = router;