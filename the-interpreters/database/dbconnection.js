/******************************************************************************
*   dbconnection.js
*
*   Author: Zachary Colbert <zcolbert@sfsu.edu>
*
*   Description:
*       Initialize the global database connection to be used by
*       all database query operations within the system.
******************************************************************************/

require("dotenv").config();

const mysql = require("mysql2");

// Credentials read from environment variables
var config = {
    user:     process.env.DB_USER, // DB username
    password: process.env.DB_PASS, // DB user password
    host:     process.env.DB_HOST
};

if (process.env.NODE_ENV === "production") {
    config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
}
else {  // Running from localhost. Get config from .env
    config.host = process.env.DB_HOST;  // DB IPv4
}

const con = mysql.createConnection(config);

// Initialize connection to database
con.connect((err) => {
    if (err) throw err;
    console.log(`Connected to '${config.database}'@'${config.host}'`);
});

// Make sure the database exists
con.query("CREATE DATABASE IF NOT EXISTS `mealsight-db`;");

// Switch to the app db after it's created
con.query("USE `mealsight-db`;");


module.exports = con;

