const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");

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
app.use(passport.initialize());
app.use(passport.session());

// set the view engine to ejs
app.set("view engine", "ejs");

//body parser
app.use(express.urlencoded({ extended: false }));

//Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
