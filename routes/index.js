const express = require("express");
const passport = require("passport");
const router = express.Router();
var pgp = require("pg-promise")();

const bcrypt = require("bcrypt");
const saltrounds = 10;

// router.post("/post", (req, res) => {
// 	var postQuery = ("SELECT * from posts;");
// 	db.any(postQuery)
// 		.then(function(rows) {
// 			res.render("fakebook.ejs")
// 		})
// 		.catch(function(err) {
// 			req.flash("error", err);
// 		})
// });

//Login Page
router.get("/login", (req, res) => res.render("login"));
router.get("/", authenticationMiddleware(), function(req, res) {
	//console.log(req.user);
	//console.log(req.isAuthenticated());
	res.render("fakebook");
});

//handle registration
router.post("/register", (req, res) => {
	//res.send(req.body.username);
	const username = req.body.username;
	const email = req.body.email;
	const password = req.body.password;

	const dbConfig = process.env.DATABASE_URL;
	const db = pgp(dbConfig);
	//const db = require("../db");

	bcrypt.hash(password, saltrounds, function(err, hash) {
		//store hash in password DB
		db.none("INSERT INTO users(name, email, password) VALUES($1, $2, $3)", [
			username,
			email,
			hash
		])
			.then(() => {
				//res.send("succ");
				var query =
					"SELECT currval(pg_get_serial_sequence('users','id')) as user_id;";
				db.any(query)
					.then(function(rows) {
						//res.send(rows[0]);
						//console.log(rows[0].currval);
						//console.log(rows[0]);
						const user_id = rows[0];
						//const user_id = rows[0].currval;
						//console.log(rows);
						req.login(user_id, function(err) {
							res.redirect("/");
						});
						//res.render("fakebook.ejs");
					})
					.catch(function(err) {
						// display error message in case an error
						res.send("failure");
					});
			})
			.catch(error => {
				res.render("login");
			});
	});
});

passport.serializeUser(function(user_id, done) {
	console.log("ok");
	done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {
	done(null, user_id);
});

function authenticationMiddleware() {
	return (req, res, next) => {
		//console.log("logged in");
		console.log(`
		req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
		if (req.isAuthenticated()) return next();
		//console.log("not nogged in");
		res.redirect("login");
	};
}

module.exports = router;
