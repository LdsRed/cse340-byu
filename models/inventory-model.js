const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
    return await pool.query("SELECT * FROM public.classification ORDER BY  classification_name")
}
module.exports = {getClassifications}



/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id){
   try {
    const data = await pool.query(
        `SELECT * FROM public.inventory AS i
        JOIN public.classification AS c
        ON i.classification_id = c.classification_id
        WHERE i.classification_id = $1`,
        [classification_id]
    )
    return data.rows;
   } catch(error) {
    console.error("getclassificationsbyid error" + error);
   }
}

async function getVehicleById(inventory_id){
    const query = 'SELECT * FROM inventory WHERE inv_id = $1';
    const values = [inventory_id];

    try {
        const result = await pool.query(query, values);
        return result.rows;
        
    }catch(error) {
            console.error("Error fetching the vehicle data: ", error);
            throw error;
    }
    
}

//

async function addNewVehicleClassification(classification_name){

    const query = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *";
    try {
        const result = await pool.query(query, [classification_name]);
        return result.rows[0];
    } catch (error) {
       console.error("Error adding new classification: ", error);
       return false;
    }
}

async function addNewVehicleInventory(reqBody){

    const query =  `INSERT INTO public.inventory (
            inv_make, inv_model, inv_year, inv_description,
            inv_image, inv_thumbnail, inv_price, inv_miles,
            inv_color, classification_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
    try{

        return await pool.query(query, [
            reqBody.inv_make,
            reqBody.inv_model,
            reqBody.inv_year,
            reqBody.inv_description,
            reqBody.inv_image,
            reqBody.inv_thumbnail,
            reqBody.inv_price,
            reqBody.inv_miles,
            reqBody.inv_color,
            reqBody.classification_id
        ]);
    }catch (error){
        console.error("Error adding inventory: ", error);
        return false;
    }

}



module.exports = {
    getClassifications,
    getInventoryByClassificationId,
    getVehicleById,
    addNewVehicleClassification,
    addNewVehicleInventory}