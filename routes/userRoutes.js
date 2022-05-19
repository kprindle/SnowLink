const express = require("express");
const controller = require("../controllers/userController");
const { isGuest } = require("../middlewares/auth");
const {
	validateSignUp,
	validateLogIn,
	validateResult,
} = require("../middlewares/validator");
const { isLoggedIn } = require("../middlewares/auth");

const router = express.Router();

router.get("/new", isGuest, controller.new);

//router.post('/', isGuest, validateResult, validateSignUp, controller.create);
router.post("/", isGuest, controller.create);

router.get("/login", isGuest, controller.getUserLogin);

//router.post('/login', isGuest, validateResult, validateLogIn, controller.login);
router.post("/login", isGuest, controller.login);

router.get("/profile", isLoggedIn, controller.profile);
router.get("/logout", isLoggedIn, controller.logout);

module.exports = router;
