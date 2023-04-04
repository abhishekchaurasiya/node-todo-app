const jwt = require("jsonwebtoken");
const User = require("../models/userModel")
const { JWT_SCRET_KEY } = require("../config/index")

const isAuthenticated = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) return res.status(401).json({
            status: false,
            message: "Login first"
        });

        const decoded = await jwt.verify(token, JWT_SCRET_KEY);
        const user = await User.findById(decoded._id);
        
        req.user = user;
        next();

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

module.exports = isAuthenticated;