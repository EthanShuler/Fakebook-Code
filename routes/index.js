const express = require("express");
const passport = require("passport");
const router = express.Router();
var pgp = require("pg-promise")();

const bcrypt = require("bcrypt");
const saltrounds = 10;

const dbConfig = process.env.DATABASE_URL;
const db = pgp(dbConfig);
//const db = require("../db");

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
router.get("/login", (req, res, next) => res.render("login"));

router.get("/", authenticationMiddleware(), function(req, res) {
	//console.log(req.user);
	//console.log(req.isAuthenticated());
	db.any("SELECT poster, text FROM posts")
		.then(function(rows) {
			res.render("fakebook", {
				data: rows
			});
		})

		.catch(function(err) {
			res.render("/login");
		});
	//res.render("fakebook");
});

router.post("/submitPost", (req, res, next) => {
	const message = req.body.message;
	db.none("INSERT INTO posts(poster, text) VALUES($1, $2)", ["temp", message])
		.then(() => {
			res.redirect("/");
		})
		.catch(function(err) {
			res.redirect("/");
		});
});

router.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/login"
	})
);

//handle registration
router.post("/register", (req, res, next) => {
	//res.send(req.body.username);
	const username = req.body.username;
	const email = req.body.email;
	const password = req.body.password;

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
						const user_id = rows[0];
						req.login(user_id, function(err) {
							res.redirect("/");
						});
					})
					.catch(function(err) {
						// display error message in case an error
						res.render("login");
					});
			})
			.catch(error => {
				res.render("login");
			});
	});
});

passport.serializeUser(function(user_id, done) {
	done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {
	//console.log("in DEserializeUser. user_id:");
	//console.log(user_id);
	done(null, user_id);
});

function authenticationMiddleware() {
	return (req, res, next) => {
		//console.log("logged in");
		console.log(`
		req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
		if (req.isAuthenticated()) return next();
		//console.log("not nogged in");
		else {
			res.redirect("login");
		}
	};
}

module.exports = router;
