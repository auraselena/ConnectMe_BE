const mysql = require("mysql2");

const db = mysql.createConnection({
    // host: "localhost",
    host: process.env.DB_HOST,
    // user: "root",
    user: process.env.DB_USER,
    // password: "ajeng101",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA,
    port: 3306,//ini port mysql
    // multipleStatement: true,
  });

module.exports = { db }