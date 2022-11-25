const express = require("express");
const axios = require("axios");
const config = require("config");
const mongoose = require("mongoose");
const router = express.Router();
const Auth = require("../../middleware/auth");
const userProfile = require("../../models/Profile");
const User = require("../../models/User");
const userPost = require("../../models/Post");
const { check, validationResult } = require("express-validator");

// - Route - /profile/me
// - Request type - GET
// - Desc - Get current user profile
// - Access type - Private - Token required
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

// - Route - /profile
// - Request type - Post
// - Desc - Create or update a user profile
// - Access type - Private - Token required
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

        // - build profile object

        // - profile object
        const profileFields = {};

        // -  build social object

        // - this object is used for the object within the social profile field
        profileFields.social = {};

        // - Set the user to the logged in user
        profileFields.user = req.user.id;

        // - Array of standard fields
        // - Standard fields are just input fields and have no nested arrays or objects that will change
        const standardFields = [
            "company",
            "website",
            "location",
            "bio",
            "status",
            "githubusername",
        ];

        // - Social input fields are nested within the standardFields array
        const socialFields = ["youtube", "twitter", "instagram", "facebook", "linkedin"];

        // - This is object needs to be seperate as they need to be added to an array
        const { skills } = req.body;

        // - Loop through the arrays to see if each field is true
        // - If each field is true then set the standard field to that value

        standardFields.forEach((field) => {
            if (req.body[field]) profileFields[field] = req.body[field];
        });

        if (skills) {
            profileFields.skills = skills.split(",").map((skill) => skill.trim());
        }

        socialFields.forEach((field) => {
            if (req.body[field]) profileFields.social[field] = req.body[field];
        });

        try {
            // - find the profile
            let profile = await userProfile.findOne({ user: req.user.id });
            // - if the profile is found - update the profile with the new info
            if (profile) {
                profile = await userProfile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                );
                return res.json(profile);
            }

            // - If the profile is not found - create a profile with the new info
            profile = new userProfile(profileFields);

            await profile.save();

            res.json(profile);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }
    }
);

// - Route - /profile
// - Request type - GET
// - Desc - Get all Profiles
// - Access type - Public
router.get("/", async (req, res) => {
    try {
        const profiles = await userProfile.find().populate("user", ["name", "avatar"]);
        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// - Route - /profile/user/:user_id
// - Request type - GET
// - Desc - Get Profile based on user id
// - Access type - Public
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

// - Route - /profile
// - Request type - DELETE
// - Desc - Delete a Profile, user and post
// - Access type - Private - Token required
router.delete("/", Auth, async (req, res) => {
    try {
        // - Remove user posts
        await userPost.deleteMany({ user: req.user.id });
        // - Remove the users profile
        await userProfile.findOneAndRemove({ user: req.user.id });
        // - Remove the user
        await User.findOneAndRemove({ _id: req.user.id });
        res.json({ msg: "User has been removed" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// - Route - /profile/experience
// - Request type - PUT
// - Desc - Add profile experience
// - Access type - Private - Token required
router.put(
    "/experience",
    [
        Auth,
        [
            check("title", "Title is required").not().isEmpty(),
            check("company", "Company name is required").not().isEmpty(),
            check("from", "Start Date is required").not().isEmpty(),
        ],
    ],
    async (req, res) => {
        // - Check for errors with the above checks
        const errors = validationResult(req);

        // - If there are errors then return the status code and error array
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        // - If there are no errors continue

        // - Descructure the fields needed from req.body
        // - These are the fields the user will fill with their experiences
        const { title, company, location, from, to, current, description } = req.body;

        // - Create a new object with the fields that will have new values
        // - These fields will be filled for each experience the user wants to add
        const newExp = { title, company, location, from, to, current, description };

        try {
            // - Find the profile
            const profile = await userProfile.findOne({ user: req.user.id });

            // - Submit the data from newExp object to the profile
            profile.experience.unshift(newExp);

            // - Save the updated profile
            await profile.save();

            res.json(profile);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }
    }
);

// - Route - /profile/experience
// - Request type - DELETE
// - Desc - Delete profile experience
// - Access type - Private - Token required
router.delete("/experience/:exp_id", Auth, async (req, res) => {
    try {
        const profile = await userProfile.findOneAndUpdate(
            { user: req.user.id },
            { $pull: { experience: { _id: req.params.exp_id } } },
            { new: true }
        );

        await profile.save();

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// - Route - /profile/education
// - Request type - PUT
// - Desc - Add profile education
// - Access type - Private - Token required
router.put(
    "/education",
    [
        Auth,
        [
            check("school", "School is required").not().isEmpty(),
            check("degree", "Degree name is required").not().isEmpty(),
            check("fieldofstudy", "Start Date is required").not().isEmpty(),
            check("from", "Start Date is required").not().isEmpty(),
        ],
    ],
    async (req, res) => {
        // - Check for errors with the above checks
        const errors = validationResult(req);
        // - If there are errors then return the status code and error array
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        // - If there are no errors continue

        // - Descructure the fields needed from req.body
        // - These are the fields the user will fill with their experiences
        const { school, degree, fieldofstudy, from, to, current, description } = req.body;

        // - Create a new object with the fields that will have new values
        // - These fields will be filled for each experience the user wants to add
        const newEducation = { school, degree, fieldofstudy, from, to, current, description };

        try {
            // - Find the profile
            const profile = await userProfile.findOne({ user: req.user.id });

            // - Submit the data from newExp object to the profile
            profile.education.unshift(newEducation);

            // - Save the updated profile
            await profile.save();

            res.json(profile);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }
    }
);

// - Route - /profile/education/:edu_id
// - Request type - DELETE
// - Desc - Delete profile education
// - Access type - Private - Token required
router.delete("/education/:edu_id", Auth, async (req, res) => {
    try {
        const profile = await userProfile.findOneAndUpdate(
            { user: req.user.id },
            { $pull: { education: { _id: req.params.edu_id } } },
            { new: true }
        );

        await profile.save();

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// - Route - /profile/github/:username
// - Request type - GET
// - Desc - Get users repos
// - Access type - Public
router.get("/github/:username", async (req, res) => {
    try {
        const uri = encodeURI(
            `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
        );
        const headers = {
            "user-agent": "node.js",
            Authorization: `token ${config.get("OAUTH_TOKEN")}`,
        };

        const gitHubResponse = await axios.get(uri, { headers });
        return res.json(gitHubResponse.data);
    } catch (err) {
        console.error(err.message);
        return res.status(404).json({ msg: "No Github profile found" });
    }
});

module.exports = router;
