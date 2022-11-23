const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");

//* - Route - /auth
//* - Request type - GET
//* - Desc - Test Route
//* - Access type - Public
router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

//* - Route - api/auth
//* - Request type - POST
//* - Desc - Authenticate user and generate a token
//* - Access type - Public
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
            //* - see if user exists
            let user = await User.findOne({ email });

            //* - if the user doesn't exist it will return a 400 status code and error message
            if (!user) return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });

            //* - if the user does exist the code below will run

            //* - check to make sure the password matches with the user email/password in the database
            const emailMatch = (await email) === user.email;
            const passwordMatch = await bcrypt.compare(password, user.password);

            //* - check to make sure both of the above are true
            if (!emailMatch) res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
            if (!passwordMatch) res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });

            //* - return json web token
            const payload = {
                user: {
                    id: user.id,
                },
            };

            //* - Sign the token
            //* - This will secure the token during transit as without the secret you can not use the token
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
