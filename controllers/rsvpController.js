const model = require("../models/rsvp");
const connections = require("../models/connection");
const users = require("../models/user");
const rsvp = require("../models/rsvp");

let newRsvp = new rsvpModel(); //create a new newRsvp document
rsvp = req.body.rsvp;
newRsvp.userID = req.session.user;
newRsvp.connectionID = req.params.id;
newRsvp
	.save() //save rsvp to database
	.then((rsvp) => {
		req.flash("sucess", "rsvp submitted");
	})
	.catch((err) => {
		if (err.name === "ValidationError") {
			req.flash("error", err.message);
			return res.redirect("/Connections");
		}
		next(err);
	});
