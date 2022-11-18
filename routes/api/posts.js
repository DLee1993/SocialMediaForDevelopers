const express = require("express");
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

module.exports = router;
