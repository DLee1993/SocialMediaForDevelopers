const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Auth = require("../../middleware/auth");
const userProfile = require("../../models/Profile");
const { check, validationResult } = require("express-validator");

//info - Route - /profile/me
//info - Request type - GET
//info - Desc - Get current user profile
//info - Access type - Private - Token required
router.get("/me", Auth, async (req, res) => {
    try {
        const profile = await userProfile
            .findOne({ user: req.user.id })
            .populate("user", ["name", "avatar"]);
        if (!profile) return res.status(400).json({ msg: "There is no profile for this user" });
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

//info - Route - /profile
//info - Request type - Post
//info - Desc - Create or update a user profile
//info - Access type - Private - Token required
router.post(
    "/",
    [
        Auth,
        [
            check("status", "Status is required").not().isEmpty(),
            check("skills", "Skills is required").not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) res.status(400).json({ errors: errors.array() });

        //info - build profile object

        // destructure the request
        const {
            company,
            website,
            location,
            bio,
            status,
            githubUsername,
            skills,
            youtube,
            twitter,
            instagram,
            linkedin,
            facebook,
        } = req.body;

        //info - build profile object
        const profileFields = {};

        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubUsername) profileFields.githubUsername = githubUsername;
        if (skills) {
            profileFields.skills = skills.split(",").map((skill) => skill.trim());
        }

        //  build social object
        //info - this object is used for the object within the social profile field
        profileFields.social = {};

        if (youtube) profileFields.social.youtube = youtube;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (twitter) profileFields.social.twitter = twitter;
        if (instagram) profileFields.social.instagram = instagram;

        try {
            //info - find the profile
            let profile = await userProfile.findOne({ user: req.user.id });
            //info - if the profile is found - update the profile with the new info
            if (profile) {
                profile = await userProfile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                );
                return res.json(profile);
            }

            //info - If the profile is not found - create a profile with the new info
            profile = new userProfile(profileFields);

            await profile.save();

            res.json(profile);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }
    }
);

//info - Route - /profile
//info - Request type - GET
//info - Desc - Get all Profiles
//info - Access type - Public
router.get("/", async (req, res) => {
    try {
        const profiles = await userProfile.find().populate("user", ["name", "avatar"]);
        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

//info - Route - /profile/user/:user_id
//info - Request type - GET
//info - Desc - Get Profile based on user id
//info - Access type - Public
router.get("/user/:user_id", async (req, res) => {
    try {
        const profile = await userProfile
            .findOne({ user: req.params.user_id })
            .populate("user", ["name", "avatar"]);
        if (!profile) {
            return res.status(400).json({ msg: "Profile not found" });
        }
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        const valid = mongoose.Types.ObjectId.isValid(req.params.user_id);
        if (!valid) {
            return res.status(400).json({ msg: "Profile not found" });
        }
        res.status(500).send("Server Error");
    }
});

module.exports = router;
