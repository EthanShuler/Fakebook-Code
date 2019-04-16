const pgp = require("pg-promise")();

//database config
const dbConfig = {
	host: "localhost",
	port: 5432,
	database: "testusers",
	user: "postgres",
	password: "postgres"
};

//connect to postgres
const db = pgp(dbConfig);

module.exports = db;
