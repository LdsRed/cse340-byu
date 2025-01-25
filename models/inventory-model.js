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


module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById}