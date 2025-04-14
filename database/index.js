const { Pool } = require("pg")
require("dotenv").config()
/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */


const isDev = process.env.NODE_ENV === "development";
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isDev
        ? false
        : { rejectUnauthorized: false },
});

// Added for troubleshooting queries
// during development
module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params)
      if(isDev){
        console.log("executed query", { text })
      }
      return res;
    }catch (error) {
      console.error("error in query", { text })
      throw error
    }
  }
}