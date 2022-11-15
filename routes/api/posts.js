const express = require("express");
const router = express.Router();

//info - Route - api/posts
//info - Request type - GET
//info - Desc - Test Route
//info - Access type - Public
router.get("/", (req, res) => {
    res.send("posts route");
});

module.exports = router; 