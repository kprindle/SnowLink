const model = require("../models/user");
const connection = require("../models/connection");
const rsvp = require("../models/rsvp");

//gets register page
exports.new = (req, res) => {
	return res.render("./user/new");
};

//creates new user
exports.create = (req, res, next) => {
	let user = new model(req.body);
	if (user.email) user.email = user.email.toLowerCase();
	user
		.save()
		.then((user) => {
			req.flash("success", "Registration succeeded!");
			res.redirect("/users/login");
		})
		.catch((err) => {
			if (err.name === "ValidationError") {
				req.flash("error", err.message);
				return res.redirect("back");
			}

			if (err.code === 11000) {
				req.flash("error", "Email has been used");
				return res.redirect("back");
			}
			next(err);
		});
};

//gets user login page
exports.getUserLogin = (req, res, next) => {
	return res.render("./user/login");
};

//logs in user
exports.login = (req, res, next) => {
	let email = req.body.email;
	if (email) {
		email = email.toLowerCase();
	}
	let password = req.body.password;
	model
		.findOne({ email: email })
		.then((user) => {
			if (!user) {
				req.flash("error", "wrong email address");
				res.redirect("/users/login");
			} else {
				user.comparePassword(password).then((result) => {
					if (result) {
						req.session.user = user._id;
						req.flash("success", "You have successfully logged in");
						res.redirect("/users/profile");
					} else {
						req.flash("error", "wrong password");
						res.redirect("/users/login");
					}
				});
			}
		})
		.catch((err) => next(err));
};

//gets users profile page
exports.profile = (req, res, next) => {
	let id = req.session.user;
	Promise.all([
		model.findById(id),
		connection.find({ author: id }),
		rsvp.find({ user: id }).populate("connection"),
	])
		.then((results) => {
			const [user, connections, rsvps] = results;
			res.render("./user/profile", { user, connections, rsvps });
		})
		.catch((err) => next(err));
};

//logs out user
exports.logout = (req, res, next) => {
	req.session.destroy((err) => {
		if (err) return next(err);
		else res.redirect("/");
	});
};
