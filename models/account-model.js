const pool = require("../database");
const bcrypt = require("bcrypt");


/* ***************************
 * Create the user in the DB
 * ************************** */
async function registerUser({account_firstname, account_lastnmae, account_email, account_password}){

    try{
        //Hash the password
        const salt = 10;
        const hashedPassword = await bcrypt.hash(account_password, salt);

        const query = `
            INSERT INTO account (account_firstname, account_lastnmae, account_email, account_password, account_type)
            VALUES ($1, $2, $3, $4, 'Client')
            RETURNING *
        `;
        
        const values = [account_firstname, account_lastnmae, account_email, hashedPassword];
        const result = await pool.query(query, values);

        return result.rows[0];

    }catch(error) {
        console.error(error);
        throw new Error("Failed to create the user: " + error.message);
    }
}


    /* ***************************
    * Find user by Email
    * ************************** */


async function findByEmail(account_email) {
    try {

        const query = `
            SELECT account_id, account_firstname, account_lastnmae, account_email, account_password, account_type
            FROM public.account
            WHERE account_email = $1
        `;

        const result = await pool.query(query, account_email);
        return result.rows[0];

    }catch(error){
        throw error;
    }
}


/* ***************************
* Find user by ID
* ************************** */

async function findById(account_id) {
    try {
        const query = `
            SELECT account_id, account_firstname, account_lastnmae, account_email, account_password, account_type
            FROM public.account
            WHERE account_id = $1
        `;

        const result = await pool.query(query, account_id)
        return result.rows[0];

    }catch(error){
        throw error;
    }
}

async function comparePassword(account_password, hashedPassword){
    const isMatch = await bcrypt.compare(account_password, hashedPassword);
    
    if(!isMatch){
        throw new Error("Wrong password");
    }
    
    return isMatch;
}

module.exports = {registerUser, comparePassword, findByEmail, findById}