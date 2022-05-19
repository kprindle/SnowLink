const express = require("express");
const controller = require("../controllers/connectionController");
const { isLoggedIn, isNotAuthor, isAuthor } = require("../middlewares/auth");
const { validateId, validateConnection } = require("../middlewares/validator");

const router = express.Router();

router.get("/", controller.index); //connetcions Page
router.get("/new", isLoggedIn, controller.new); //new connection page
router.post("/", isLoggedIn, validateConnection, controller.create); //creates new connection
router.get("/:id", validateId, controller.show); //connectiondetails page
router.get("/:id/edit", validateId, isLoggedIn, isAuthor, controller.edit); //edit page
router.put(
	"/:id",
	validateId,
	isLoggedIn,
	isAuthor,
	validateConnection,
	controller.update
); //update connectionn after edit
router.delete("/:id", validateId, isLoggedIn, isAuthor, controller.delete); //delete connection
router.post("/:id/rsvp", validateId, isLoggedIn, isNotAuthor, controller.rsvp); //rsvp to the event
router.delete("/:id/rsvp", validateId, isLoggedIn, controller.deleteRSVP); //delete rsvp

module.exports = router;
