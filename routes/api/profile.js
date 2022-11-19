const express = require("express");
const axios = require("axios");
const config = require("config");
const mongoose = require("mongoose");
const router = express.Router();
const Auth = require("../../middleware/auth");
const userProfile = require("../../models/Profile");
const User = require("../../models/User");
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

        //info - profile object
        const profileFields = {};

        //info -  build social object

        //info - this object is used for the object within the social profile field
        profileFields.social = {};

        //info - Set the user to the logged in user
        profileFields.user = req.user.id;

        //info - Array of standard fields
        //info - Standard fields are just input fields and have no nested arrays or objects that will change
        const standardFields = [
            "company",
            "website",
            "location",
            "bio",
            "status",
            "githubUsername",
            "skills",
        ];

        //info - Social input fields
        //info - Array of social media fields nested within the social field of the project modal
        //info - This is array needs to be seperate as you need to access the profileFields.social to change the values
        const socialFields = ["youtube", "twitter", "instagram", "facebook", "linkedin"];

        //info - Loop through the arrays to see if each field is true
        //info - If each field is true then set the standard field to that value

        standardFields.forEach((field) => {
            if (req.body[field]) profileFields[field] = req.body[field];
            if (req.body[field] === "skills") {
                req.body[field].split(",").map((skill) => skill.trim());
            }
        });

        socialFields.forEach((field) => {
            if (req.body[field]) profileFields.social[field] = req.body[field];
        });

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

//info - Route - /profile
//info - Request type - DELETE
//info - Desc - Delete a Profile, user and post
//info - Access type - Private - Token required
router.delete("/", Auth, async (req, res) => {
    try {
        //TODO - Remove users posts
        //info - Remove the users profile
        await userProfile.findOneAndRemove({ user: req.user.id });
        //info - Remove the user
        await User.findOneAndRemove({ _id: req.user.id });
        res.json({ msg: "User has been removed" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

//info - Route - /profile/experience
//info - Request type - PUT
//info - Desc - Add profile experience
//info - Access type - Private - Token required
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
        //info - Check for errors with the above checks
        const errors = validationResult(req);

        //info - If there are errors then return the status code and error array
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        //info - If there are no errors continue

        //info - Descructure the fields needed from req.body
        //info - These are the fields the user will fill with their experiences
        const { title, company, location, from, to, current, description } = req.body;

        //info - Create a new object with the fields that will have new values
        //info - These fields will be filled for each experience the user wants to add
        const newExp = { title, company, location, from, to, current, description };

        try {
            //info - Find the profile
            const profile = await userProfile.findOne({ user: req.user.id });

            //info - Submit the data from newExp object to the profile
            profile.experience.unshift(newExp);

            //info - Save the updated profile
            await profile.save();

            res.json(profile);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }
    }
);

//info - Route - /profile/experience
//info - Request type - DELETE
//info - Desc - Delete profile experience
//info - Access type - Private - Token required
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

//info - Route - /profile/education
//info - Request type - PUT
//info - Desc - Add profile education
//info - Access type - Private - Token required
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
        //info - Check for errors with the above checks
        const errors = validationResult(req);
        //info - If there are errors then return the status code and error array
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        //info - If there are no errors continue

        //info - Descructure the fields needed from req.body
        //info - These are the fields the user will fill with their experiences
        const { school, degree, fieldofstudy, from, to, current, description } = req.body;

        //info - Create a new object with the fields that will have new values
        //info - These fields will be filled for each experience the user wants to add
        const newEducation = { school, degree, fieldofstudy, from, to, current, description };

        try {
            //info - Find the profile
            const profile = await userProfile.findOne({ user: req.user.id });

            //info - Submit the data from newExp object to the profile
            profile.education.unshift(newEducation);

            //info - Save the updated profile
            await profile.save();

            res.json(profile);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }
    }
);

//info - Route - /profile/education/:edu_id
//info - Request type - DELETE
//info - Desc - Delete profile education
//info - Access type - Private - Token required
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

//info - Route - /profile/github/:username
//info - Request type - GET
//info - Desc - Get users repos
//info - Access type - Public
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
