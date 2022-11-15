const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

//info - Route - api/users
//info - Request type - POST
//info - Desc - Register a new user
//info - Access type - Public
router.post(
    "/",
    [
        check("name", "Please enter a name").not().isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password ( min length of 6 )").isLength({ min: 6 }),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        res.send('User added')
    }
);

module.exports = router;
