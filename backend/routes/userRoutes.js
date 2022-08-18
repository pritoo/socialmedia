const express = require("express");
const { register,login, followUser } = require("../controllers/userController");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();


router.route("/register").post(register);

router.route("/login").get(login);

router.route("/follow/:id").get(isAuthenticated,followUser)

module.exports = router
