const Jwt = require("jsonwebtoken");
const { JWT_SCRET_KEY } = require("../config/index");
const { Node_Env } = require("../config/index")

const sendCookies = (user, res, message, statusCode = 200) => {
    // Generate here token 
    const token = Jwt.sign({ _id: user._id }, JWT_SCRET_KEY);

    res.status(statusCode).cookie("token", token, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
        sameSite: Node_Env === "Development" ? "lax" : "none",
        secure: Node_Env === "Development" ? false : true,
    }).json({
        success: true,
        message,
    })
}

module.exports = sendCookies;