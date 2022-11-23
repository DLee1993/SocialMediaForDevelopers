const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Auth = require("../../middleware/auth");
const userPost = require("../../models/Post");
const userProfile = require("../../models/Profile");
const User = require("../../models/User");

// - Route - api/posts
// - Request type - POST
// - Desc - Create a post
// - Access type - Private - Token Required
router.post("/", [Auth, [check("text", "Text is Required").not().isEmpty()]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }

    try {
        // - find the logged in user by the id
        const user = await User.findById(req.user.id).select("-password");

        // - New post object to be filled with data from user
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

// - Route - api/posts
// - Request type - GET
// - Desc - Get all posts
// - Access type - Private - Token Required
router.get("/", Auth, async (req, res) => {
    try {
        // - find the logged in user by the id
        const posts = await userPost.find().sort({ date: -1 });
        res.json(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// - Route - api/posts/id
// - Request type - GET
// - Desc - Get post by id
// - Access type - Private - Token Required
router.get("/:id", Auth, async (req, res) => {
    try {
        // - find the post by the id
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

// - Route - api/posts/id
// - Request type - DELETE
// - Desc - Delete a post
// - Access type - Private - Token Required
router.delete("/:id", Auth, async (req, res) => {
    try {
        // - find the post by the id
        const post = await userPost.findById(req.params.id);

        // - check to see if post exists
        if (!post) res.status(404).json({ msg: "Post not found" });

        // - check user is authorised to delete this post
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

// - Route - api/posts/like/id
// - Request type - PUT
// - Desc - Like a post
// - Access type - Private - Token Required
router.put("/like/:id", Auth, async (req, res) => {
    try {
        // - find the post by the id
        const post = await userPost.findById(req.params.id);

        // - check to see if user has already like the post
        const likedPost = post.likes.find((like) => like.user.toString() === req.user.id);

        likedPost
            ? res.status(400).json({ msg: "Post already liked" })
            : post.likes.unshift({ user: req.user.id });

        await post.save();

        res.json(post.likes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// - Route - api/posts/unlike/id
// - Request type - PUT
// - Desc - Remove a like from a post
// - Access type - Private - Token Required
router.put("/unlike/:id", Auth, async (req, res) => {
    try {
        // - find the post by the id
        const post = await userPost.findById(req.params.id);

        // - check to see if user has already like the post
        const unlikedPost = post.likes.find((like) => like.user.toString() === req.user.id);

        !unlikedPost
            ? res.status(400).json({ msg: "Post has not yet been liked" })
            : unlikedPost.remove();

        await post.save();

        res.json(post.likes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// - Route - api/posts/comment/id
// - Request type - POST
// - Desc - Create a comment
// - Access type - Private - Token Required
router.post(
    "/comment/:id",
    [Auth, [check("text", "Text is Required").not().isEmpty()]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }

        try {
            // - find the logged in user by the id
            const user = await User.findById(req.user.id).select("-password");
            const post = await userPost.findById(req.params.id);

            // - New post object to be filled with data from user
            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id,
            };

            post.comments.unshift(newComment);
            await post.save();

            res.json(post.comments);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }
    }
);

// - Route - api/posts/comment/id
// - Request type - DELETE
// - Desc - Delete a comment
// - Access type - Private - Token Required
router.delete("/comment/:id/:comment_id", Auth, async (req, res) => {
    try {
        // - find the post by the id
        const post = await userPost.findById(req.params.id);

        // - Find the comment by id
        const comment = post.comments.find((comment) => comment.id === req.params.comment_id);

        !comment
            ? res.status(404).json({ msg: "Comment does not exist" })
            : comment.user.toString() !== req.user.id
            ? res.status(401).json({ msg: "User not authorized" })
            : comment.remove();

        await post.save();

        res.json(post.comments);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
