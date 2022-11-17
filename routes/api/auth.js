const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");

//info - Route - /auth
//info - Request type - GET
//info - Desc - Test Route
//info - Access type - Public
router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

//info - Route - api/auth
//info - Request type - POST
//info - Desc - Authenticate user and generate a token
//info - Access type - Public
router.post(
    "/",
    [
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email, password } = req.body;

        try {
            //info - see if user exists
            let user = await User.findOne({ email });

            //info - if the user doesn't exist it will return a 400 status code and error message
            if (!user) return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });

            //info - if the user does exist the code below will run

            //info - check to make sure the password matches with the user email/password in the database
            const emailMatch = (await email) === user.email;
            const passwordMatch = await bcrypt.compare(password, user.password);

            //info - check to make sure both of the above are true
            if (!emailMatch) res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
            if (!passwordMatch) res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });

            //info - return json web token
            const payload = {
                user: {
                    id: user.id,
                },
            };

            //info - Sign the token
            //info - This will secure the token during transit as without the secret you can not use the token
            jwt.sign(payload, config.get("jwtSecret"), { expiresIn: 360000 }, (err, token) => {
                if (err) throw err;
                res.json({ token });
            });
        } catch (error) {
            console.error(error.msg);
            res.status(500).send("Server error");
        }
    }
);

module.exports = router;
