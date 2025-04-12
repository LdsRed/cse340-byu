const pool = require("../database");
const bcrypt = require("bcrypt");



const profileModel = {



    async getUserById(account_id){
        const query = 'SELECT * FROM public.account WHERE account_id = $1';
        const values = [account_id];

        try {
            const result = await pool.query(query, values);
            return result.rows;

        }catch(error) {
                console.error("Error fetching the user data: ", error);
                throw error;
        }

    },


    async updateProfile(userId,{account_firstname, account_lastname, account_email} ){
            try {
                const sql = `UPDATE public.account SET
                account_firstname = $1,
                account_lastname = $2,
                account_email = $3,
                WHERE account_id = $4
                RETURNING *`;
                const values = [account_firstname, account_lastname, account_email, userId];
                const result = await pool.query(sql, values);
                return result.rows[0];

            }catch (error) {
                console.error("Error updating profile: ", error);
                throw error;
            }
    },


    async verifyPassword(userId, account_password){
        try {
            const sql = `SELECT account_password FROM public.account WHERE
                      account_id = $1`;
            const result = await pool.query(sql, [userId]);
            const user = result.rows[0];
            const isMatch = await bcrypt.compare(account_password, user.account_password);
            return isMatch;
        }catch (error) {
            console.error("Error verifying password: ", error);
            throw error;
        }
    },


    async updatePassword(userId, newPassword){
        try {

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const sql = `UPDATE account 
            SET account_password = $1
            WHERE account_id= $2`;

            const result = await pool.query(sql, [hashedPassword, userId]);
            return result.rows[0];
        }catch (error) {
            console.error("Error updating password: ", error);
            throw error;
        }
    }
}