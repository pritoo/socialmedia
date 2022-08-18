const express = require("express")
const {createPost,deletePost, likeAndUnlikePost} =require("../controllers/postController")
const {isAuthenticated} = require("../middleware/auth")
const router = express.Router();

router.route("/post/upload").post(isAuthenticated,createPost);

router.route("/post/:id").get(isAuthenticated,likeAndUnlikePost);

router.route("/post/:id").delete(isAuthenticated,deletePost);

module.exports = router
