const jwt = require("jsonwebtoken");
const config = require("config");

const Auth = async (req, res, next) => {
    //info - get token from header
    const token = req.header("x-auth-token");

    //info - check if no token
    if (!token) return res.status(401).json({ msg: "Authorisation denied, no token provided" });

    //info - if there is a token we need to verify it
    try {
        const decoded = jwt.verify(token, config.get("jwtSecret"));
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({ msg: "Token is not valid" });
    }
};

module.exports = Auth;
