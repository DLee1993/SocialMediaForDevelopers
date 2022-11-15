const express = require("express");
const router = express.Router();

//info - Route - api/profile
//info - Request type - GET
//info - Desc - Test Route
//info - Access type - Public
router.get("/", (req, res) => {
    res.send("profile route");
});

module.exports = router; 