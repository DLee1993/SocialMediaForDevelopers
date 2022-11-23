const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../../models/User");

//* - Route - api/users
//* - Request type - POST
//* - Desc - Register a new user
//* - Access type - Public
router.post(
    "/",
    [
        check("name", "Please enter a name").not().isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password ( min length of 6 )").isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { name, email, password } = req.body;

        try {
            //* - see if user exists
            let user = await User.findOne({ email });

            //* - if the user exists it will return a 400 status code and error message
            if (user) return res.status(400).json({ errors: [{ msg: "User already exists" }] });

            //* - if the user doesn't exist the code below will run

            //* - get users gravatar ( profile picture )
            const avatar = gravatar.url(email, {
                s: "200",
                r: "pg",
                d: "mm",
            });

            //* - Create a new instance of a user
            user = new User({
                name,
                email,
                avatar,
                password,
            });

            //* - encrypt the users password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            //* - save the new user
            await user.save();

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
