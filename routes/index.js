const express = require("express");
const passport = require("passport");
const router = express.Router();

const bcrypt = require("bcrypt");
const saltrounds = 10;

//Login Page
router.get("/login", (req, res) => res.render("login"));

//handle registration
router.post("/register", (req, res) => {
	//res.send(req.body.username);
	const username = req.body.username;
	const email = req.body.email;
	const password = req.body.password;

	const db = require("../db");

	bcrypt.hash(password, saltrounds, function(err, hash) {
		//store hash in password DB
		db.none("INSERT INTO users(username, email, password) VALUES($1, $2, $3)", [
			username,
			email,
			hash
		])
			.then(() => {
				res.render("fakebook.ejs");
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
	User.findById(id, function(err, user_id) {
		done(null, user_id);
	});
});

module.exports = router;
