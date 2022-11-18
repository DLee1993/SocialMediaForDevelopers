const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Auth = require("../../middleware/auth");
const userPost = require("../../models/Post");
const userProfile = require("../../models/Profile");
const User = require("../../models/User");

//info - Route - api/posts
//info - Request type - POST
//info - Desc - Create a post
//info - Access type - Private - Token Required
router.post("/", [Auth, [check("text", "Text is Required").not().isEmpty()]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }

    try {
        //info - find the logged in user by the id
        const user = await User.findById(req.user.id).select("-password");

        //info - New post object to be filled with data from user
        const newPost = new userPost({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id,
        });

        const post = await newPost.save();

        res.json(post);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

//info - Route - api/posts
//info - Request type - GET
//info - Desc - Get all posts
//info - Access type - Private - Token Required
router.get("/", Auth, async (req, res) => {
    try {
        //info - find the logged in user by the id
        const posts = await userPost.find().sort({ date: -1 });
        res.json(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

//info - Route - api/posts/id
//info - Request type - GET
//info - Desc - Get post by id
//info - Access type - Private - Token Required
router.get("/:id", Auth, async (req, res) => {
    try {
        //info - find the post by the id
        const post = await userPost.findById(req.params.id);

        if (!post) res.status(404).json({ msg: "Post not found" });

        res.json(post);
    } catch (error) {
        console.error(error.message);
        const valid = mongoose.Types.ObjectId.isValid(req.params.id);
        if (!valid) {
            return res.status(400).json({ msg: "Post not found" });
        }
        res.status(500).send("Server Error");
    }
});

//info - Route - api/posts/id
//info - Request type - DELETE
//info - Desc - Delete a post
//info - Access type - Private - Token Required
router.delete("/:id", Auth, async (req, res) => {
    try {
        //info - find the post by the id
        const post = await userPost.findById(req.params.id);

        //info - check to see if post exists
        if (!post) res.status(404).json({ msg: "Post not found" });

        //info - check user is authorised to delete this post
        post.user.toString() !== req.user.id
            ? res.status(401).json({ msg: "User not authorised" })
            : await post.remove();

        res.json({ msg: "Post removed" });
    } catch (error) {
        console.error(error.message);
        const valid = mongoose.Types.ObjectId.isValid(req.params.id);
        if (!valid) {
            return res.status(400).json({ msg: "Post not found" });
        }
        res.status(500).send("Server Error");
    }
});

module.exports = router;
