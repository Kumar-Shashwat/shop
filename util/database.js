const mySql = require("mysql2");

const pool = mySql.createPool( {
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    database : process.env.DB_DATABASE,
    password : process.env.DB_PASSWORD,
    port: process.env.DB_PORT

});

module.exports = pool.promise();