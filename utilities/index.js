const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data);
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid +=  '<a href="/inv/details/'+ vehicle.inv_id
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model
      + 'details"><img src="' + vehicle.inv_thumbnail
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<h2>'
      grid += '<a href="/inv/details/' + vehicle.inv_id +'" title="View '
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$'
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildInventoryDetail = async function(vehicleData){
    const price = parseFloat(vehicleData[0].inv_price).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
    const mileage = parseInt(vehicleData[0].inv_miles).toLocaleString()

    return `
            <div class= "vehicle-details">
                  
                  <div class="vehicle-image-container">
                    <img src="${vehicleData[0].inv_image}" alt="Image of ${vehicleData[0].inv_make} ${vehicleData[0].inv_model}">
                  </div>

                  <div class="vehicle-description-container">
                    <h2>${vehicleData[0].inv_make} ${vehicleData[0].inv_model} Details</h2>
                     <p><strong>Year: </strong>${vehicleData[0].inv_year}</p>
                     <p><strong>Price: </strong>${price}</p>
                     <p><strong>Mileage: </strong>${mileage}</p>
                     <p><strong>Description: </strong>${vehicleData[0].inv_description}</p>
                  </div>
            </div>`
            
}

Util.buildClassificationList = async function(classification_id = null){
  let data = await invModel.getClassifications();
  let classificationList =
      `<select name="classification_id" id="classificationId"   required>`

  classificationList +=
      "<option value=''> Choose a Classification </option>";

  data.rows.forEach( row => {
    classificationList += '<option value="' + row.classification_id + '"';

    if(classification_id != null && row.classification_id == classification_id){
      classificationList +=  " selected";
    }

    classificationList += ">" + row.classification_name + "</option>"
  })

  classificationList += '</select>';
  return classificationList;

}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util