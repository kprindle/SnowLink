const model = require("../models/connection");
const rsvpModel = require("../models/rsvp");

exports.index = (req, res, next) => {
	model
		.find()
		.then((connections) =>
			res.render("./connection/connections", { connections })
		)
		.catch((err) => next(err));
};

exports.new = (req, res) => {
	res.render("./connection/new");
};

exports.create = (req, res, next) => {
	let connection = new model(req.body); //create a new connection document
	connection.author = req.session.user;
	connection
		.save() //insert the document to the database
		.then((connection) => {
			req.flash("success", "Connection has been created successfully");
			res.redirect("/connections");
		})
		.catch((err) => {
			if (err.name === "ValidationError") {
				req.flash("error", err.message);
				return res.redirect("/back");
			}
			next(err);
		});
};

exports.show = (req, res, next) => {
	let id = req.params.id;
	let user = req.session.user;
	Promise.all([
		model.findById(id),
		rsvpModel.count({ connection: id, rsvp: "yes" }),
	])
		.then((results) => {
			const [connection, rsvps] = results;
			if (connection) {
				return res.render("./connection/ConnectionDetail", {
					connection,
					user,
					rsvps,
				});
			} else {
				let err = new Error("Cannot find a connection with id " + id);
				err.status = 404;
				next(err);
			}
		})
		.catch((err) => next(err));
};

exports.edit = (req, res, next) => {
	let id = req.params.id;
	model
		.findById(id)
		.then((connection) => {
			if (connection) {
				return res.render("./connection/editConnection", { connection });
			} else {
				let err = new Error("Cannot find a connection with id " + id);
				err.status = 404;
				next(err);
			}
		})
		.catch((err) => next(err));
};

exports.update = (req, res, next) => {
	let connection = req.body;
	let id = req.params.id;
	model
		.findByIdAndUpdate(id, connection, {
			useFindAndModify: false,
			runValidators: true,
		})
		.then((connection) => {
			return res.redirect("/connections/" + id);
		})
		.catch((err) => {
			if (err.name === "ValidationError") {
				req.flash("error", err.message);
				return res.redirect("/back");
			}
			next(err);
		});
};

exports.delete = (req, res, next) => {
	let id = req.params.id;
	Promise.all([
		model.findByIdAndDelete(id, { userFindAndModify: false }),
		rsvpModel.deleteMany({ connection: id }),
	])
		.then((connection) => {
			if (connection) {
				res.redirect("/connections");
			} else {
				let err = new Error("Cannot find a connection with id " + id);
				err.status = 404;
				return next(err);
			}
		})
		.catch((err) => next(err));
};

exports.rsvp = (req, res, next) => {
	console.log(req.body.rsvp);
	let id = req.params.id;
	let User = req.session.user;
	rsvpModel.findOne({ connection: id, user }).then((rsvp) => {
		if (rsvp) {
			//update
			rsvpModel
				.findOneAndUpdate(
					rsvp._id,
					{ rsvp: req.body.rsvp },
					{ userFindAndModify: false, runValidators: true }
				)
				.then((rsvp) => {
					req.flash("sucess", "sucessfully updated rsvp");
					res.redirect("/users/profile");
				})
				.catch((err) => {
					console.log(err);
					next(err);
				});
		} else {
			//create
			let rsvp = new rsvpModel({
				connection: id,
				rsvp: req.body.rsvp,
				user: User,
			});
			rsvp
				.save()
				.then((rsvp) => {
					req.flash("sucess", "sucessfully created rsvp");
					res.redirect("/users/profile");
				})
				.catch((err) => next(err));
		}
	});
};

exports.deleteRSVP = (req, res, next) => {
	let id = req.params.id;
	let User = req.session.user;
	rsvpModel
		.findOneAndDelete({ connection: id, user: User })
		.then((rsvp) => {
			req.flash("success", "Succesfully deleted RSVP");
			res.redirect("/users/profile");
		})
		.catch((err) => {
			req.flash("error", err.message);
			next(err);
		});
};
