const express = require("express");
const router = express.Router();

//info - Route - api/auth
//info - Request type - GET
//info - Desc - Test Route
//info - Access type - Public
router.get("/", (req, res) => {
    res.send("auth route");
});

module.exports = router; 