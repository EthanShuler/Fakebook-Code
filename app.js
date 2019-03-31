const express = require("express");
const session = require("express-session");

const THREE_HOURS = 1000 * 60 * 60 * 3;

const {
	PORT = 3000,
	NODE_ENV = "development",
	SESS_NAME = "sid",
	SESS_SECRET = "DonaldTrumpLovesFakeNews!",
	SESS_LIFETIME = THREE_HOURS
} = process.env;

const IN_PROD = NODE_ENV === "production";

//set up app
const app = express();

app.use(
	session({
		name: SESS_NAME,
		resave: false,
		saveUninitialized: false,
		secret: SESS_SECRET,
		cookie: {
			maxAge: SESS_LIFETIME, //two hours
			sameSite: true,
			secure: IN_PROD
		}
	})
);

const pgp = require("pg-promise")();

//database config
const dbConfig = {
	host: "localhost",
	port: 5432,
	database: "football_db",
	user: "postgres",
	password: "postgres123"
};

//connect to postgres
var db = pgp(dbConfig);

// set the view engine to ejs
app.set("view engine", "ejs");

app.use(express.static("public"));

//body parser
app.use(express.urlencoded({ extended: false }));

//Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
