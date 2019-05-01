const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const uuid = require("uuid/v4");
var pgp = require("pg-promise")();
var bcrypt = require("bcrypt");

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

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(cookieParser());
//set static path for css, img, js files
app.use(express.static(__dirname + "/public"));

const pg = require("pg");
const pgSession = require("connect-pg-simple")(session);

var pgPool = new pg.Pool({
	host: "localhost",
	port: 5432,
	database: "testusers",
	user: "postgres",
	password: "postgres"
});

app.use(
	session({
		// store: new pgSession({
		// 	pool: pgPool
		// }),

		store: new pgSession({
			conString: process.env.DATABASE_URL
		}),
		genid: req => {
			//console.log("Inside the session middleware");
			//console.log(req.sessionID);
			return uuid(); // use UUIDs for session IDs
		},
		//name: SESS_NAME,
		resave: false,
		saveUninitialized: false,
		secret: SESS_SECRET
		// cookie: {
		// 	maxAge: SESS_LIFETIME, //two hours
		// 	sameSite: true,
		// 	secure: IN_PROD
		// }
	})
);
app.use(passport.initialize());
app.use(passport.session());

// set the view engine to ejs
app.set("view engine", "ejs");

//body parser
app.use(express.urlencoded({ extended: false }));

//Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

passport.use(
	new LocalStrategy(
		{
			usernameField: "login_user",
			passwordField: "login_pass"
		},
		function(username, password, done) {
			//console.log(username);
			//console.log(password);

			const dbConfig = process.env.DATABASE_URL;
			const db = pgp(dbConfig);

			//const db = require("./db");

			db.any("SELECT id, password from users where name = $1", [username])
				.then(function(data) {
					if (data.length == 0) {
						return done(null, false);
					} else {
						//console.log(data[0]);
						const hash = data[0].password;
						bcrypt.compare(password, hash, function(err, response) {
							if (response === true) {
								return done(null, { user_id: data[0].id });
							} else {
								return done(null, false);
							}
						});
					}
				})

				.catch(function(err) {
					return done(err);
				});

			//return done(null, false);
		}
	)
);

app.use(function(req, res, next) {
	res.status(404).render("404");
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
