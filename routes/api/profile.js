const express = require("express");
const router = express.Router();
const Auth = require("../../middleware/auth");
const userProfile = require("../../models/Profile");
const User = require("../../models/User");

//info - Route - /profile/me
//info - Request type - GET
//info - Desc - Get current user profile
//info - Access type - Private - Token required
router.get("/me", Auth, async (req, res) => {
    try {
        const profile = await userProfile
            .findOne({ user: req.user.id })
            .populate("user", ["name", "avatar"]);
        if(!profile) return res.status(400).json({msg: 'There is no profile for this user'}); 
        res.json(profile)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;
